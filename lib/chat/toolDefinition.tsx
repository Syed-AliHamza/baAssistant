import { generateText, streamText } from 'ai'
import {
  buildCountQuery,
  buildPaginatedQuery,
  GRAPH_ITEMS_PER_PAGE,
  ITEMS_PER_PAGE,
  nanoid,
  PAGE_NUMBER,
  transformedColumns
} from '@/lib/utils'
import { createOpenAI } from '@ai-sdk/openai'

import { closeDBConnection, getDBConnection } from '../db/mssqlDb'
import { azure } from './actions'
import { BotCard } from '@/components/stocks/message'
import { BotResponse } from '@/components/dataVisuals/botResponse'
import { BotMessage } from '@/components/stocks/botMessage'

import { SearchClient, AzureKeyCredential } from '@azure/search-documents'
import {
  AGENTS,
  documentGraderPrompt,
  initialSpinnerState,
  SPINNER_STEPS
} from '../utils/constants'
import { emailSender } from '@/app/actions'
import { updateSpinnerState } from '../utils/functions'
import StatusMessage from '@/components/StatusMessage'

const perplexity = createOpenAI({
  name: 'perplexity',
  apiKey: process.env.PERPLEXITY_API_KEY ?? '',
  baseURL: process.env.PERPLEXITY_BASE_URL
})

const searchClient = new SearchClient(
  process.env.AZURE_AI_SEARCH_ENDPOINT,
  process.env.AZURE_AI_SEARCH_INDEX,
  new AzureKeyCredential(process.env.AZURE_AI_SEARCH_KEY)
)

export const addGraphConditionalEdges = ({
  totalCount,
  spinnerStream,
  queryError
}) => {
  const graphCondition = !queryError && totalCount <= GRAPH_ITEMS_PER_PAGE
  if (!graphCondition) {
    spinnerStream.update(null)
  }
  return graphCondition
}

export const classifyQuestion = async ({
  userInput,
  spinnerStream,
  agent,
  spinnerState
}) => {
  let type = ''
  let newState
  if (agent === AGENTS.PANDA) {
    const { text } = await generateText({
      model: azure(process.env.AZURE_OPENAI_MODEL),
      system:
        'You are a helpful assistant that classifies user questions into categories based on their intent.',
      messages: [
        {
          role: 'user',
          content: `Based on the input provided: '${userInput}', evaluate the intent behind the user's question. Determine if the question pertains to data retrieval or management, such as generating SQL queries, fetching, retrieving, or providing data. If the question is focused on these topics, respond with 'dataRequest'. If the question is general or unrelated to data management, respond with 'generalQuestion'.`
        }
      ]
    })
    const classification = text.trim().toLowerCase()

    if (classification === 'datarequest') {
      newState = updateSpinnerState(
        spinnerState,
        SPINNER_STEPS.MINING,
        'Mining data insights... 🔍'
      )
      spinnerStream.update(<StatusMessage steps={newState.steps} />)
      type = 'dataRequest'
    } else {
      newState = updateSpinnerState(
        spinnerState,
        SPINNER_STEPS.CRAFTING_RESPONSE,
        'Crafting your response... ✨'
      )
      spinnerStream.update(<StatusMessage steps={newState.steps} />)
      type = 'generalQuestion'
    }
  } else if (agent === AGENTS.RESEARCH_STUDIES) {
    newState = updateSpinnerState(
      spinnerState,
      SPINNER_STEPS.EXPLORING_DATABASE,
      'Nova is thinking... 🧠'
    )
    spinnerStream.update(<StatusMessage steps={newState.steps} />)
    type = 'azureSearch'
  } else if (agent === AGENTS.AI_INTERN) {
    newState = updateSpinnerState(
      spinnerState,
      SPINNER_STEPS.THINKING,
      'Nova is thinking... 🧠'
    )
    spinnerStream.update(<StatusMessage steps={newState.steps} />)
    type = 'aiIntern'
  }
  return { questionType: type, spinnerState: newState }
}

export const generalResponse = async ({
  userInput,
  model,
  messageStream,
  spinnerStream,
  threadId,
  aiState
}) => {
  const result = await model({
    prompt: `Respond to the user's input: "${userInput}". Provide a friendly response relevant to the question asked.`,
    systemInstructions:
      'You are a helpful AI assistant. Keep your response concise and friendly, and make sure it connects to the information related to SQL queries or previous chat history but you will not be responding with sql query.'
  })

  let textContent = ''
  spinnerStream.update(null)
  for await (const delta of result.fullStream) {
    const { type, finishReason } = delta

    if (type === 'finish' && finishReason === 'stop') {
      messageStream.update(
        <BotMessage id={threadId} content={textContent} isFinish={true} />
      )
      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: 'assistant',
            content: textContent
          }
        ]
      })
    }

    if (type === 'text-delta') {
      const { textDelta } = delta
      textContent += textDelta
      messageStream.update(<BotMessage id={threadId} content={textContent} />)
    }
  }

  return {}
}

const fetchSQLQuery = async ({ userInput }) => {
  const sqlInstructions = `Note: These are your instructions: If the number of records requested exceeds 10,000, Vanna should automatically generate a SELECT query to fetch all records without applying any TOP limit. If the request is for 10,000 records or fewer, Vanna should generate a query using SELECT TOP (10000) to limit the results to the specified maximum. Every query generated by Vanna must include an ORDER BY clause. If the user has requested to order by a specific column, Vanna should use that column for ordering. If the user has not requested any specific column for ordering, Vanna should first check if there is a column mentioned in the user questions which is: "${userInput}". If a column is found, it should always be used for ordering; otherwise, Vanna should automatically select an appropriate column to ensure the results are consistently ordered.`

  const apiUrl = `${process.env.VANNA_BASE_URL}/api/v0/generate_sql?question=${userInput + 'user question ends here. Intructions are next: ' + sqlInstructions}`
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching SQL query:', error)
  }
}

function createState({ defaultValue }) {
  return {
    value: (x, y) => y,
    default: () => defaultValue
  }
}

export const graphState = ({
  threadId,
  uiStream,
  messageStream,
  aiState,
  history,
  spinnerStream,
  textStream,
  agent
}) => ({
  userInput: null,
  sqlQuery: null,
  model: null,
  uiStream: createState({ defaultValue: uiStream }),
  messageStream: createState({ defaultValue: messageStream }),
  aiState: createState({ defaultValue: aiState }),
  spinnerStream: createState({ defaultValue: spinnerStream }),
  textStream: createState({ defaultValue: textStream }),
  spinnerState: createState({ defaultValue: initialSpinnerState }),
  name: createState({ defaultValue: 'panda' }),
  history: createState({ defaultValue: history }),
  systemInstructions: null,
  explanation: null,
  assumption: null,
  threadId: createState({ defaultValue: threadId }),
  typeOfChart: null,
  xAxisProperty: null,
  yAxisProperty: null,
  tableData: null,
  totalCount: null,
  questionType: null,
  searchStrategy: null,
  azureAIResponse: null,
  rephrasedText: null,
  documents: null,
  agent: createState({ defaultValue: agent }),
  queryError: createState({ defaultValue: '' })
})

export const generateSQLQuery = async ({
  uiStream,
  userInput,
  spinnerStream,
  spinnerState
}) => {
  uiStream.update(<BotResponse isQueryLoading />)
  const vannaRes = await fetchSQLQuery({ userInput })
  let sqlQuery = vannaRes?.text
  uiStream.update(<BotResponse sqlQuery={sqlQuery} />)
  const newState = updateSpinnerState(
    spinnerState,
    SPINNER_STEPS.CRAFTING_EXPLAINATION,
    'Crafting your explanation... 💡'
  )
  spinnerStream.update(<StatusMessage steps={newState.steps} />)

  return { sqlQuery, spinnerState: newState }
}

export const createModel = async ({ aiState }) => {
  const model = async ({ prompt, systemInstructions, modelInstance }) => {
    const history = aiState.get().messages.map(message => ({ ...message }))
    const messages = [...history]

    if (prompt) {
      messages[messages.length - 1].content = prompt
    }

    return await streamText({
      model: modelInstance || azure(process.env.AZURE_OPENAI_MODEL),
      ...(systemInstructions && { system: systemInstructions }),
      messages
    })
  }
  return { model: model }
}

export const explainQuery = async ({
  sqlQuery,
  model,
  uiStream,
  spinnerStream,
  spinnerState
}) => {
  uiStream.update(<BotResponse sqlQuery={sqlQuery} isExplanationLoading />)
  const result = await model({
    prompt: `Expain the SQL query and tell me the assumptions of the query in JSON format sqlQuery is ${sqlQuery}`,
    systemInstructions:
      'You are an helpful AI assistant, you required to only reply in json format to user query you will be return only two key in response "assumption" and "explanation" make sure the same spelling.'
  })
  let textContent = ''
  let assumption = ''
  let explanation = ''

  for await (const delta of result.fullStream) {
    const { type } = delta
    if (type === 'finish') {
      const cleanedContent = textContent.replace(/```json|```/g, '').trim()
      const queryDetails = JSON.parse(cleanedContent)
      assumption = queryDetails.assumption
      explanation = queryDetails.explanation

      uiStream.update(
        <BotResponse
          sqlQuery={sqlQuery}
          assumptions={assumption}
          explanation={explanation}
        />
      )
    }

    if (type === 'text-delta') {
      const { textDelta } = delta
      textContent += textDelta
    }
  }
  const newState = updateSpinnerState(
    spinnerState,
    SPINNER_STEPS.EXPLAINING,
    'Processing data... 📊'
  )
  spinnerStream.update(<StatusMessage steps={newState.steps} />)
  return {
    explanation: explanation,
    assumption: assumption,
    spinnerState: newState
  }
}

export const presentData = async ({
  uiStream,
  threadId,
  sqlQuery,
  assumption,
  explanation,
  spinnerStream,
  aiState,
  spinnerState
}) => {
  uiStream.update(
    <BotResponse
      isTableLoading
      assumptions={assumption}
      explanation={explanation}
      sqlQuery={sqlQuery}
      threadId={threadId}
    />
  )

  const pool = await getDBConnection()
  let result
  let totalCount
  let columns
  let errorMessage = ''
  let newState

  try {
    const request = pool.request()

    const countQuery = buildCountQuery({ sqlQuery })
    const countResult = await request.query(countQuery)
    totalCount = countResult.recordset[0]?.totalCount || 0

    const offset = (PAGE_NUMBER - 1) * ITEMS_PER_PAGE
    const finalQuery = buildPaginatedQuery(sqlQuery, offset, ITEMS_PER_PAGE)
    result = await request.query(finalQuery)
    columns = transformedColumns({
      columns: result.recordsets[0]?.columns || []
    })
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error)

    result = { recordset: [] }
    columns = []
  } finally {
    await closeDBConnection()
    newState = updateSpinnerState(
      spinnerState,
      SPINNER_STEPS.VISUALIZING,
      'Creating your visualization... 📊'
    )
    spinnerStream.update(<StatusMessage steps={newState.steps} />)

    uiStream.update(
      <BotResponse
        sqlQuery={sqlQuery}
        assumptions={assumption}
        explanation={explanation}
        fetchedData={result?.recordset || []}
        columns={columns}
        totalCount={totalCount}
        threadId={threadId}
        error={errorMessage}
      />
    )
  }

  const graphCondition = totalCount <= GRAPH_ITEMS_PER_PAGE
  if (!graphCondition || errorMessage) {
    const props = {
      sqlQuery,
      assumptions: assumption,
      explanation,
      totalCount
    }

    aiState.done({
      ...aiState.get(),
      interactions: [],
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: '',
          display: {
            name: 'showData',
            props: props
          }
        }
      ]
    })
  }
  return {
    totalCount,
    tableData: result?.recordset || [],
    tableColumn: columns,
    queryError: errorMessage,
    spinnerState: newState
    // add error message to prevent graph
  }
}

export const graphicalRepresentation = async ({
  sqlQuery,
  model,
  uiStream,
  spinnerStream,
  assumption,
  explanation,
  tableData,
  tableColumn,
  aiState,
  totalCount,
  threadId
}) => {
  uiStream.update(
    <BotResponse
      sqlQuery={sqlQuery}
      assumptions={assumption}
      explanation={explanation}
      fetchedData={tableData}
      columns={tableColumn}
      totalCount={totalCount}
      threadId={threadId}
      isGraphLoading
    />
  )
  const result = await model({
    prompt: `Analyze the SQL query and determine the appropriate chart type based on the data. Specify what should be displayed on the X-axis and what should be displayed on the Y-axis. The SQL query is: ${sqlQuery}`,
    systemInstructions:
      'You are a helpful AI assistant. You are required to reply only in JSON format to the user’s query. You must return only three keys in the response: "typeOfChart", "xAxisProperty", and "yAxisProperty". Ensure the spelling is correct and consistent. The "typeOfChart" value can be "bar" only.'
  })

  let textContent = ''
  let typeOfChart = ''
  let xAxisProperty = ''
  let yAxisProperty = ''

  for await (const delta of result.fullStream) {
    const { type } = delta
    if (type === 'finish') {
      const cleanedContent = textContent.replace(/```json|```/g, '').trim()
      try {
        const chartDetails = JSON.parse(cleanedContent)
        typeOfChart = chartDetails.typeOfChart
        xAxisProperty = chartDetails.xAxisProperty
        yAxisProperty = chartDetails.yAxisProperty

        const offset = (PAGE_NUMBER - 1) * ITEMS_PER_PAGE
        const graphQuery = buildPaginatedQuery(
          sqlQuery,
          offset,
          GRAPH_ITEMS_PER_PAGE
        )
        const pool = await getDBConnection()
        const request = pool.request()
        const graphData = await request.query(graphQuery)
        spinnerStream.update(null)

        uiStream.update(
          <BotResponse
            sqlQuery={sqlQuery}
            assumptions={assumption}
            explanation={explanation}
            fetchedData={tableData}
            graphData={graphData?.recordset || []}
            columns={tableColumn}
            typeOfChart={typeOfChart}
            xAxisProperty={xAxisProperty}
            yAxisProperty={yAxisProperty}
            totalCount={totalCount}
            threadId={threadId}
          />
        )
      } catch (error) {
        console.error('Error parsing JSON:', error)
        uiStream.append(
          <BotCard>
            <p className="text-muted-foreground">
              An error occurred while processing the chart details.
            </p>
          </BotCard>
        )
      }
    }

    if (type === 'text-delta') {
      const { textDelta } = delta
      textContent += textDelta
    }
  }
  const props = {
    sqlQuery,
    assumptions: assumption,
    explanation,
    totalCount,
    typeOfChart,
    xAxisProperty,
    yAxisProperty
  }
  aiState.done({
    ...aiState.get(),
    interactions: [],
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'assistant',
        content: '',
        display: {
          name: 'showData',
          props: props
        }
      }
    ]
  })

  return { typeOfChart, xAxisProperty, yAxisProperty }
}

export const azureSearch = async ({
  userInput,
  spinnerStream,
  spinnerState
}) => {
  try {
    const azureSearchResults = await performAzureSearch(userInput)
    const documents = []
    for await (const result of azureSearchResults) {
      documents.push(result.document)
    }

    const newState = updateSpinnerState(
      spinnerState,
      SPINNER_STEPS.EVALUATING_DOCUMENT,
      'Evaluating documents... 📝'
    )
    spinnerStream.update(<StatusMessage steps={newState.steps} />)
    return { documents: documents, spinnerState: newState }
  } catch (error) {
    console.error('Azure Search Error:', error)
    return { results: 'Error performing search.' }
  }
}

const performAzureSearch = async query => {
  const searchOptions = {
    top: 5
  }

  const searchResults = await searchClient.search(query, searchOptions)

  return searchResults.results
}

export const rephraseText = async ({
  documents,
  uiStream,
  model,
  spinnerStream,
  threadId,
  userInput,
  aiState
}) => {
  const concatenatedText = documents.map(doc => doc.chunk).join(' ')
  const result = await model({
    prompt: `Based on the following information, answer the question: "${userInput}". Here is the relevant content: "${concatenatedText}"`,
    systemInstructions:
      'You are an expert language assistant. Provide a specific and concise answer that directly addresses the user’s question. Make sure to preserve the meaning of the provided content without adding unnecessary information.'
  })
  let textContent = ''
  spinnerStream.update(null)

  for await (const delta of result.fullStream) {
    const { type } = delta
    if (type === 'finish') {
      uiStream.update(
        <BotMessage id={threadId} content={textContent} isFinish={true} />
      )
      aiState.update({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: 'assistant',
            content: textContent
          }
        ]
      })
    }

    if (type === 'text-delta') {
      const { textDelta } = delta
      textContent += textDelta
      uiStream.update(
        <BotMessage id={threadId} content={textContent}></BotMessage>
      )
    }
  }
}

const generateTextResponse = async ({
  model = process.env.AZURE_OPENAI_MODEL,
  systemMessage,
  userInput,
  messageTemplate,
  messages
}) => {
  try {
    const response = await generateText({
      model: azure(model),
      system: systemMessage,
      messages: messages || [
        {
          role: 'user',
          content:
            messageTemplate ||
            `Based on the input provided: '${userInput}', provide a relevant response.`
        }
      ]
    })
    return response
  } catch (error) {
    console.error('Error in generating response:', error)
    return 'Error in generating response'
  }
}

export const gradeContent = async ({ azureAIResponse, userInput }) => {
  try {
    const { text } = await generateTextResponse({
      systemMessage:
        'You are an expert content grader that checks whether a document is relevant to the user’s question.',
      userInput,
      messageTemplate: `Evaluate the relevance of the following content to the user's query: "${userInput}". Document: "${azureAIResponse}". Respond with either 'Relevant' or 'Not Relevant'.`
    })

    return text === 'Relevant' ? 'Relevant' : 'Not Relevant'
  } catch (error) {
    console.error('Error grading content:', error)
    return 'Not Relevant'
  }
}

export const documentGrader = async ({
  documents,
  userInput,
  aiState,
  spinnerStream,
  uiStream,
  threadId
}) => {
  const relevantDocs = []

  for (const doc of documents) {
    const { text } = await generateTextResponse({
      systemMessage:
        'You are an expert content grader that checks whether a document is relevant to the user’s question.',
      userInput: userInput,
      messageTemplate: documentGraderPrompt({
        document: doc.chunk,
        userInput: userInput
      })
    })
    if (text.toLowerCase() === 'yes') {
      relevantDocs.push(doc)
    }
  }

  // Check if we found any relevant documents
  const hasDocuments = relevantDocs.length > 0

  if (!hasDocuments) {
    const textContent =
      "I couldn't find any relevant information in the provided documents to answer your question. Would you like to try rephrasing your question or would you prefer to explore a different topic?"
    spinnerStream.update(null)
    uiStream.update(
      <BotMessage id={threadId} content={textContent} isFinish={true} />
    )
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: textContent
        }
      ]
    })
  }
  return {
    documents: relevantDocs
  }
}
export const hasRelevantDocuments = ({
  documents,
  spinnerStream,
  spinnerState
}) => {
  let newState
  if (documents.length > 0) {
    newState = updateSpinnerState(
      spinnerState,
      SPINNER_STEPS.REWORDING_TEXT,
      'Rewording your text... ✍️'
    )
    spinnerStream.update(<StatusMessage steps={newState.steps} />)
  } else {
    newState = updateSpinnerState(
      spinnerState,
      SPINNER_STEPS.WEB_SEARH,
      'Scanning the web... 🌐'
    )
    spinnerStream.update(<StatusMessage steps={newState.steps} />)
  }
  return documents.length > 0
}

export const perplexitySearch = async ({
  spinnerStream,
  model,
  uiStream,
  aiState,
  threadId,
  spinnerState
}) => {
  const newState = updateSpinnerState(
    spinnerState,
    SPINNER_STEPS.WEB_SEARH,
    'Exploring the web... 🔍'
  )
  spinnerStream.update(<StatusMessage steps={newState.steps} />)
  const result = await model({
    modelInstance: perplexity(process.env.PERPLEXITY_MODEL_NAME),
    systemInstructions:
      'You are a helpful AI assistant. Respond to the user input. Provide a friendly response relevant to the question asked. keep the response short not more than 10 words.'
  })

  spinnerStream.update(null)
  let textContent = ''
  for await (const delta of result.fullStream) {
    const { type } = delta
    if (type === 'finish') {
      uiStream.update(
        <BotMessage id={threadId} content={textContent} isFinish={true} />
      )
      aiState.update({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: 'assistant',
            content: textContent
          }
        ]
      })
    }

    if (type === 'text-delta') {
      const { textDelta } = delta
      textContent += textDelta
      uiStream.update(
        <BotMessage id={threadId} content={textContent}></BotMessage>
      )
    }
  }
}

export const aiIntern = async ({
  spinnerStream,
  model,
  uiStream,
  threadId,
  aiState,
  userInput,
  spinnerState
}) => {
  let newState
  const messages = aiState.get().messages.map(message => ({ ...message }))
  const simplifiedMessages = messages.map(message => ({
    role: message.role,
    content: message.content
  }))

  if (simplifiedMessages.length > 0) {
    const lastMessage = simplifiedMessages[simplifiedMessages.length - 1]
    lastMessage.content = `This is user input: "${userInput}", respond based on system instruction or chat history and the response must always be in JSON format.`
  }

  const { text } = await generateTextResponse({
    systemMessage: `You are an expert content grader whose sole task is to determine if the user's input is an explicit request to send an email. You will return in JSON format
  
  Only if the user explicitly requests to "send" or "send this email" (or a very similar phrase) and all required information (to, subject, emailBody) is present, respond with only the exact text in key "type": "sendemail". respond with JSON including the following structure:
    {
    "type": "sendemail",
    "details": {
      "to": "<recipient_email>", Type: string | array (required) (Recipient Information field)
      "cc": "<optional_cc_email>", Type: string | array (optional)
      "bcc": "<optional_bcc_email>", Type: string | array  (optional)
      "subject": "<optional_subject>", Type: string  (optional)
      "emailBody": "<main_content_of_the_email>" Type: html in string (optional) (key points)
    }
  }

        -If the user insists on sending the email without the required details, proceed to send it, but respond with a disclaimer like:
      - "Sending the email as requested, though some details may be incomplete."

            - **Required Field**:
        - **Recipient Information ("to")**: If missing, prompt with, "Who’s it going to? (Please include the email address.)"

      - **Optional Fields** (ask only if mentioned by the user but left blank):
        - **CC**
        - **BCC**
        - **Subject**
        - **Email Body ("emailBody")**
  
  If any required information is missing, respond only with the exact text: other and ask for the missing details by prompting:
  - Recipient Information: "Who’s it going to? (Please include the email address.)" - "to" field (required)
  - Key Points: "Are there any key points or specific details you'd like included in the email?" - "emailBody" field (optional)
  - Tone of the Email: "How would you like it to sound? Would you prefer a more formal or casual tone?" (optional)
  
  In every other case, respond only with the exact text in key "type": "other". 
  
  Important: **Respond with only one of the following two responses: sendemail or other**. Do not provide any additional information, instructions, or explanations.
      {
    "type": "other",
    "missing info": ["missing fields"]
  }
  
  Example of explicit requests:
  - "Please send this email."
  - "Send the email now."

  
  Without such explicit phrasing, respond with only: other
  .
  `,
    messages: simplifiedMessages
  })
  const cleanedContent = text.replace(/```json|```/g, '').trim()
  let error = ''
  const response = JSON.parse(cleanedContent)
  const shouldSendEmail = response?.type.includes('sendemail')
  if (shouldSendEmail) {
    const { to, cc, bcc, subject, emailBody } = response?.details || {}
    try {
      newState = updateSpinnerState(
        spinnerState,
        SPINNER_STEPS.SENDING_EMAIL,
        'Sending your email... ✉️'
      )
      spinnerStream.update(<StatusMessage steps={newState.steps} />)
      await emailSender({
        label: process.env.BUSINESS_NAME,
        receiver: to,
        cc,
        bcc,
        subject: subject,
        body: emailBody
      })
      console.log('here text', response?.details)
    } catch (e) {
      error = e instanceof Error ? e.message : String(e)
      console.log('here error', e)
    }
  }
  console.log('here response type', response.type)
  const result = await model({
    prompt: userInput,
    systemInstructions: `
    Your name is Smart BA, a collaborative and detail-oriented AI assistant specializing in generating user stories through interactive discussions with the user. Your primary role is to engage with the user to gather detailed information about features they wish to implement. You should ask clarifying questions until you have enough information to draft comprehensive user stories in a tabular format.

    **Process for Collecting User Story Information**:
    - Engage the user by asking clear, iterative questions to gather information for the user story template.
    - Confirm each section with the user before proceeding to the next to ensure accuracy and completeness.

    **Questions to Ask the User**:
    - "What is the name of the feature or user story?"
    - "Who are the actors involved in this feature?"
    - "Can you describe the high-level flow of this feature? What happens first, and how do users interact with it?"

    **User Story Template**:
    Once you’ve gathered the necessary high-level information, you can creatively complete the story by generating the following details on your own:

    | Section              | Details                                                                  |
    |----------------------|---------------------------------------------------------------------------|
    | User Story ID        | US-XX (Generated ID for the story)                                        |
    | Name                 | [Feature Name]                                                            |
    | Description          | [Detailed description as provided by the user]                           |
    | Actors               | [Actors involved in the feature]                                         |
    | Benefits             | [Benefits of the feature]                                                |
    | Pre-conditions       | [Conditions that must be met before the feature can be used]             |
    | Post-conditions      | [Outcome once the feature is completed]                                  |
    | Acceptance Criteria  | [List of conditions that must be met for successful implementation]      |
    | Primary Flow         | [Step-by-step process of the feature]                                    |
    | Alternate Flow       | [Any alternate flows if applicable]                                      |
    | Exceptions           | [Scenarios where the process might fail and how it is handled]           |

    **Important Notes**:
    - Continue asking questions until all necessary details are gathered.
    - Provide a friendly, patient, and clear tone during interactions.
    - Never reply in JSON format or include any technical code unless specifically asked by the user.
  `
  })

  spinnerStream.update(null)
  let textContent = ''
  for await (const delta of result.fullStream) {
    const { type } = delta
    if (type === 'finish') {
      uiStream.update(
        <BotMessage id={threadId} content={textContent} isFinish={true} />
      )
      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: 'assistant',
            content: textContent
          }
        ]
      })
    }

    if (type === 'text-delta') {
      const { textDelta } = delta
      textContent += textDelta
      uiStream.update(
        <BotMessage id={threadId} content={textContent}></BotMessage>
      )
    }
  }
}

export const determineSearchType = async ({
  userInput,
  spinnerStream,
  spinnerState
}) => {
  const { text } = await generateTextResponse({
    systemMessage: `You are an expert classifier whose task is to determine if the user's input is related to email drafting/sending, greetings, or requires a general internet search. Analyze the input and respond only with JSON in the following format:
    {
      "searchStrategy": "useAI" | "useWeb"
    }
    
    Return "useAI" if:
    - The query is about drafting, writing, or sending emails
    - The query contains email-related keywords like "email", "send", "draft", "write"
    - The user is asking for help with composing a message
    - The input is a greeting or conversation starter
    - The query is asking how you are or starting a conversation
    
    Return "useWeb" if:
    - The query requires current information from the internet
    - The query is about general knowledge, facts, or recent events
    - The query would benefit from up-to-date information
    
    Respond only with the JSON structure. No additional text or explanations.`,
    messages: [
      {
        role: 'user',
        content: userInput
      }
    ]
  })

  const cleanedContent = text.replace(/```json|```/g, '').trim()
  const response = JSON.parse(cleanedContent)

  const newState = updateSpinnerState(
    spinnerState,
    response.searchStrategy === 'useAI'
      ? SPINNER_STEPS.PROCESSING
      : SPINNER_STEPS.WEB_SEARH,
    response.searchStrategy === 'useAI'
      ? 'Processing with Nova... ⚡'
      : 'Exploring the web... 🔍'
  )
  spinnerStream.update(<StatusMessage steps={newState.steps} />)

  return {
    searchStrategy: response.searchStrategy,
    spinnerState: newState
  }
}
