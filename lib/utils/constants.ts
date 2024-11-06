import { SpinnerState } from '../types'

export const documentGraderPrompt = ({ document, userInput }) =>
  `
You are a grader assessing the relevance of a retrieved document to a user question.

Here is the retrieved document: <document> ${document} </document>

Here is the user userInput: <userInput> ${userInput} </userInput>

If the document contains any keyword, phrase, or concept mentioned by the user, and it is relevant, mark the document as relevant. Even if the user only mentions one keyword, return all the information related to that keyword and mark the document as relevant.

Give a binary 'yes' or 'no' score to indicate whether the document is relevant to the question.

`

export const AGENTS = {
  PANDA: 'Panda',
  RESEARCH_STUDIES: 'Research Studies',
  AI_INTERN: 'AI Intern'
}

export const SPINNER_STEPS = {
  STARTUP: 'nova-startup',
  ANALYZING: 'analyzing-request',
  MINING: 'mining-data',
  GENERATING: 'generating-sql',
  EXPLAINING: 'explaining-query',
  PROCESSING: 'processing-data',
  VISUALIZING: 'visualizing-data',
  THINKING: 'nova-thinking',
  WEB_SEARH: 'web-search',
  CRAFTING_RESPONSE: 'crafting-response',
  CRAFTING_EXPLAINATION: 'crafting-explaination',
  EXPLORING_DATABASE: 'exploration-database',
  EVALUATING_DOCUMENT: 'evaluation-document',
  REWORDING_TEXT: 'rewording-text',
  SENDING_EMAIL: 'send-email'
}

export const initialSpinnerState: SpinnerState = {
  steps: [
    {
      id: SPINNER_STEPS.STARTUP,
      text: 'Nova coming online... 🤖',
      isCompleted: false
    }
  ],
  currentStep: SPINNER_STEPS.STARTUP
}
