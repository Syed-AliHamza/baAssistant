// @ts-nocheck
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue
} from 'ai/rsc'

import {
  buildPaginatedQuery,
  GRAPH_ITEMS_PER_PAGE,
  ITEMS_PER_PAGE,
  nanoid,
  PAGE_NUMBER
} from '@/lib/utils'
import { getUser, saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '../types'
import {
  addGraphConditionalEdges,
  aiIntern,
  azureSearch,
  classifyQuestion,
  createModel,
  determineSearchType,
  documentGrader,
  explainQuery,
  generalResponse,
  generateSQLQuery,
  graphicalRepresentation,
  graphState,
  hasRelevantDocuments,
  perplexitySearch,
  presentData,
  rephraseText
} from './toolDefinition'
import prisma from '../db/prisma'
import { BotMessage } from '@/components/stocks/botMessage'
import { createAzure } from '@ai-sdk/azure'
import { closeDBConnection, getDBConnection } from '../db/mssqlDb'
import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph'
import React from 'react'
import { GraphInterface } from './interfaces'
import { BotResponse } from '@/components/dataVisuals/botResponse'
import { initialSpinnerState } from '../utils/constants'
import StatusMessage from '@/components/StatusMessage'

export const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  resourceName: process.env.AZURE_RESOURCE_NAME
})

export const instructions = `
You are an AI assistant designed to help users interact with their databases by generating SQL queries based on the database schema.

Generate SQL Query: First, generate the SQL query based on the user's request.
Important: If the user requests a write operation (e.g., UPDATE, DELETE, or ADD), respond politely with: 
"I'm sorry, but for safety reasons, I cannot perform write operations like UPDATE, DELETE, or ADD. Please request a read-only query (e.g., SELECT).

There is no need to limit the amount of data requested by the user. The tool should generate the SQL query based on the user’s request, regardless of the count specified (e.g., even if the user asks for 100000000000000000000000000000000). The tool will respond with the requested data accordingly without modifying the original SQL query.
`

export async function getColumnNames(rows) {
  if (rows.length === 0) {
    return []
  }
  return Object.keys(rows[0])
}

export async function formatResultRows(result) {
  if (result.rows.length > 0) {
    const columnNames = Object.keys(result.rows[0])

    const columnHeader = columnNames.join(', ')
    const rowsString = result.rows
      .map(row =>
        Object.entries(row)
          .map(([key, value]) => `${key}=${value}`)
          .join(', ')
      )
      .join('\n')

    const resultString = `${columnHeader}\n${rowsString}`

    return resultString
  } else {
    return 'No rows available.'
  }
}

async function fetchPaginatedData({
  sqlQuery,
  pageNumber = 1,
  itemsPerPage = 5,
  searchTerm,
  column
}) {
  'use server'
  let searchQuery = ''
  if (searchTerm && column?.name) {
    const searchCondition = `[${column.name}] LIKE '%${searchTerm}%'`
    searchQuery = `WHERE ${searchCondition}`
  }
  const offset = (pageNumber - 1) * itemsPerPage
  const finalQuery = buildPaginatedQuery(
    sqlQuery,
    offset,
    itemsPerPage,
    searchQuery
  )

  let result
  try {
    const pool = await getDBConnection()
    const request = pool.request()
    result = await request.query(finalQuery)
  } catch (error) {
    console.error(error)
  } finally {
    await closeDBConnection()
  }

  return result?.recordset || []
}
function removeAgentMention(content, agent) {
  const agentMention = `@${agent}`

  return content.replace(new RegExp(`\\s*${agentMention}\\s*`, 'g'), '').trim()
}

const closeStreaming = ({
  uiStream,
  textStream,
  messageStream,
  spinnerStream
}) => {
  uiStream.done()
  textStream.done()
  messageStream.done()
  spinnerStream.done()
}

const streamData = async ({
  spinnerStream,
  threadId,
  uiStream,
  messageStream,
  textStream,
  content,
  agent
}) => {
  const aiState = getMutableAIState()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${aiState.get().interactions.join('\n\n')}\n\n${content}`
      }
    ],
    chatId: threadId
  })

  const history = aiState.get().messages.map(message => ({
    role: message.role,
    content: message.content
  }))

  const graph = new StateGraph<GraphInterface>({
    channels: graphState({
      threadId,
      uiStream,
      messageStream,
      aiState,
      history,
      spinnerStream,
      textStream,
      agent
    })
  })
    .addNode('classifyQuestion', classifyQuestion)
    .addNode('azureSearch', azureSearch)
    .addNode('documentGrader', documentGrader)
    .addNode('rephraseText', rephraseText)
    .addNode('determineSearchType', determineSearchType)
    .addNode('perplexitySearch', perplexitySearch)
    .addNode('aiIntern', aiIntern)
    .addNode('generateSqlQuery', generateSQLQuery)
    .addNode('create_model', createModel)
    .addNode('explainQuery', explainQuery)
    .addNode('presentData', presentData)
    .addNode('graphicalRepresentation', graphicalRepresentation)
    .addNode('closeStreaming', closeStreaming)
    .addNode('generalResponse', generalResponse)
    .addEdge(START, 'create_model')
    .addEdge('create_model', 'classifyQuestion')
    .addConditionalEdges(
      'classifyQuestion',
      ({ questionType }) => questionType,
      {
        dataRequest: 'generateSqlQuery',
        generalQuestion: 'generalResponse',
        azureSearch: 'azureSearch',
        aiIntern: 'determineSearchType'
      }
    )
    .addEdge('azureSearch', 'documentGrader')
    .addConditionalEdges(
      'documentGrader',
      ({ documents }) => documents.length > 0,
      {
        true: 'rephraseText',
        false: 'closeStreaming'
      }
    )
    .addConditionalEdges(
      'determineSearchType',
      ({ searchStrategy }) => 'useAI',
      {
        useAI: 'aiIntern',
        useWeb: 'perplexitySearch'
      }
    )

    .addEdge('generateSqlQuery', 'explainQuery')
    .addEdge('explainQuery', 'presentData')
    .addConditionalEdges('presentData', addGraphConditionalEdges, {
      true: 'graphicalRepresentation',
      false: 'closeStreaming'
    })

    .addEdge('aiIntern', 'closeStreaming')
    .addEdge('rephraseText', 'closeStreaming')
    .addEdge('perplexitySearch', 'closeStreaming')
    .addEdge('generalResponse', 'closeStreaming')
    .addEdge('graphicalRepresentation', 'closeStreaming')
    .addEdge('closeStreaming', END)

  const app = graph.compile({
    checkpointer: new MemorySaver()
  })
  let userInput = removeAgentMention(content, agent)
  await app.invoke(
    {
      userInput: userInput
    },
    { configurable: { thread_id: threadId } }
  )
}

async function submitUserMessage({ content, chatId, agent }) {
  'use server'
  // const spinnerStream = createStreamableUI(
  //   <SpinnerMessage text={'Nova coming online... 🤖'} />
  // )

  // Create streamable UI elements
  const spinnerStream = createStreamableUI(
    <StatusMessage steps={initialSpinnerState.steps} />
  )
  const textStream = createStreamableValue('')

  const messageStream = createStreamableUI(null)
  const uiStream = createStreamableUI()
  const user = await getUser()

  let savedThread
  const title = content?.substring(0, 100)

  if (!chatId) {
    try {
      savedThread = await prisma.threads.create({
        data: {
          userId: user.id,
          title: title,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error creating thread:', error)
      throw new Error('Failed to create thread', error)
    }
  }
  const threadId = savedThread?.id || chatId
  streamData({
    spinnerStream,
    threadId,
    textStream,
    uiStream,
    messageStream,
    content,
    agent
  })
  return {
    id: threadId,
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id?: string
  name?: string
  display?: {
    name: string
    props: Record<string, any>
  }
}

export type AIState = {
  chatId: number
  interactions?: string[]
  messages?: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    fetchPaginatedData
  },
  initialUIState: [],
  initialAIState: { chatId: null, interactions: [], messages: [] },
  onGetUIState: async () => {
    'use server'

    const aiState = getAIState()

    if (aiState) {
      const uiState = getUIStateFromAIState(aiState)
      // return uiState
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const { chatId, messages } = state

    const messagesList = [messages[messages.length - 1]]
    const chat: Chat = {
      id: chatId,
      messages: messagesList
    }
    // if (messagesList?.length > 0) {
    //   await saveChat(chat)
    // }
  }
})

export const getUIStateFromAIState = async (aiState: Chat) => {
  function transformedColumns({ columns }) {
    return Object.keys(columns).map(columnName => {
      return {
        name: columnName,
        type: columns[columnName].type.toString().split(' ')?.[0]
      }
    })
  }

  const sqlQueries = aiState.messages
    .filter(
      message =>
        message.role === 'assistant' && message.display?.name === 'showData'
    )
    .map(message => message?.display?.props?.sqlQuery)
    .filter(sqlQuery => sqlQuery) // Filter out null/undefined queries

  let sqlResults = {}
  let graphResults = {}
  let columnMetadata = {}
  let sqlErrors = {}

  if (sqlQueries.length > 0) {
    try {
      const pool = await getDBConnection()
      const request = pool.request()

      // Execute each SQL query and store the results
      for (const sqlQuery of sqlQueries) {
        // Extract the totalCount from the message props
        const message = aiState.messages.find(
          message => message.display?.props?.sqlQuery === sqlQuery
        )
        const totalCount = message?.display?.props?.totalCount

        try {
          if (totalCount && !isNaN(totalCount)) {
            const offset = (PAGE_NUMBER - 1) * ITEMS_PER_PAGE
            const finalQuery = buildPaginatedQuery(
              sqlQuery,
              offset,
              ITEMS_PER_PAGE
            )
            const graphQuery = buildPaginatedQuery(
              sqlQuery,
              offset,
              GRAPH_ITEMS_PER_PAGE
            )

            const result = await request.query(finalQuery)
            const columns = transformedColumns({
              columns: result.recordsets[0].columns
            })

            columnMetadata[sqlQuery] = columns

            let graphResult
            if (totalCount && totalCount > GRAPH_ITEMS_PER_PAGE) {
              graphResult = []
            } else {
              graphResult = await request.query(graphQuery)
            }

            sqlResults[sqlQuery] = result?.recordset || []
            graphResults[sqlQuery] = graphResult?.recordset || []
          } else {
            const result = await request.query(sqlQuery)
            const graphResult = await request.query(
              message.display?.props?.graphQuery
            )

            const columns = transformedColumns({
              columns: result.recordsets[0].columns
            })
            columnMetadata[sqlQuery] = columns

            sqlResults[sqlQuery] = result?.recordset || []
            graphResults[sqlQuery] = graphResult?.recordset || []
          }
        } catch (queryError) {
          const errorMessage =
            queryError instanceof Error
              ? queryError.message
              : String(queryError)
          sqlErrors[sqlQuery] = errorMessage
        }
      }
    } catch (error) {
      console.log('Error executing SQL queries:', error)
    } finally {
      await closeDBConnection()
    }
  }

  // Generate the UI state
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => {
      const {
        sqlQuery,
        assumptions,
        explanation,
        typeOfChart,
        xAxisProperty,
        yAxisProperty,
        totalCount
      } = message?.display?.props || {}
      // Check if we need to fetch data for this message
      const fetchedData = sqlQuery ? sqlResults[sqlQuery] : null
      const graphData = sqlQuery ? graphResults[sqlQuery] : null
      const columns = sqlQuery ? columnMetadata[sqlQuery] : null
      const error = sqlQuery ? sqlErrors[sqlQuery] : null
      const generativeUI = {
        id: `${aiState.chatId}-${index}`,
        display:
          message.role === 'assistant' ? (
            message.display?.name === 'showData' ? (
              <BotResponse
                sqlQuery={sqlQuery}
                assumptions={assumptions}
                explanation={explanation}
                fetchedData={fetchedData}
                graphData={graphData}
                columns={columns}
                typeOfChart={typeOfChart}
                xAxisProperty={xAxisProperty}
                yAxisProperty={yAxisProperty}
                totalCount={totalCount}
                error={error}
              />
            ) : (
              <BotMessage content={message.content} />
            )
          ) : message.role === 'user' ? (
            <UserMessage showAvatar>{message.content}</UserMessage>
          ) : (
            <BotMessage content={message.content} />
          )
      }
      return generativeUI
    })
}
