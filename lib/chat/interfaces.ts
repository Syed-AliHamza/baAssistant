
interface TableRow {
  [key: string]: any;
}

export interface GraphInterface {
  userInput: string
  sqlQuery: string
  model: unknown
  uiStream: unknown //define type
  messageStream: unknown
  aiState: unknown
  spinnerStream: unknown
  textStream: unknown
  history: Document[]
  instructions: string
  explanation: string
  assumption: string
  threadId: number
  typeOfChart: string
  xAxisProperty: string
  yAxisProperty: string
  tableData: TableRow[] | null
  totalCount: number
  questionType: string
  isEdit: boolean
  editedSqlQuery: string
  azureAIResponse: string
  rephrasedText: string
  documents: unknown
  agent: string

}


