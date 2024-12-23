export interface Chat extends Record<string, any> {
  id: number
  title: string
  createdAt: Date
  updatedAt: Date
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

export type StatusStep = {
  id: string
  text: string
  isCompleted: boolean
}

export interface SpinnerState {
  steps: StatusStep[]
  currentStep: string
}
