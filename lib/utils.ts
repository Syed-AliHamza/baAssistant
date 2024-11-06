import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input,
  init?
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

export const runAsyncFnWithoutBlocking = (
  fn: () => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')



export const getMessageFromCode = (resultCode: string) => {
  const resultCodeObj = {
    InvalidCredentials: 'INVALID_CREDENTIALS',
    InvalidSubmission: 'INVALID_SUBMISSION',
    UserAlreadyExists: 'USER_ALREADY_EXISTS',
    UnknownError: 'UNKNOWN_ERROR',
    UserCreated: 'USER_CREATED',
    UserLoggedIn: 'USER_LOGGED_IN'
  }
  switch (resultCode) {
    case resultCodeObj.InvalidCredentials:
      return 'Invalid credentials!'
    case resultCodeObj.InvalidSubmission:
      return 'Invalid submission, please try again!'
    case resultCodeObj.UserAlreadyExists:
      return 'User already exists, please log in!'
    case resultCodeObj.UserCreated:
      return 'User created, welcome!'
    case resultCodeObj.UnknownError:
      return 'Something went wrong, please try again!'
    case resultCodeObj.UserLoggedIn:
      return 'Logged in!'
  }
}

export function buildPaginatedQuery(sqlQuery, offset, itemsPerPage, searchQuery = '') {

  const cleanSqlQuery = sqlQuery.replace(/;\s*$/, '');

  // Remove the existing ORDER BY clause, if present
  const queryWithoutOrderBy = cleanSqlQuery.replace(/ORDER BY.*$/i, '').trim();

  // Extract any existing ORDER BY clause to use for ROW_NUMBER()
  const existingOrderByMatch = cleanSqlQuery.match(/ORDER BY\s+(.+?)(?:\s+|$)/i);
  const selectColumnsMatch = cleanSqlQuery.match(/SELECT\s+(?:TOP\s+\(\d+\)\s+)?(.*?)\s+FROM/i);
  const columns = selectColumnsMatch?.[1]
    .split(',')
    .map(col => col.trim())
    .filter(col => !/^TOP/i.test(col));
  let orderByElse
  if (columns?.length > 0) {

    const firstColumn = columns[columns?.length - 1].split('.').pop();;
    orderByElse = `ORDER BY ${firstColumn} ASC`;
  } else {
    orderByElse = 'ORDER BY Total_Amount DESC';
  }

  const orderByClause = existingOrderByMatch ? existingOrderByMatch[0] : orderByElse; // Default order if no ORDER BY exist

  const paginatedQuery = `
  WITH PaginatedResults AS (
    SELECT *,
      ROW_NUMBER() OVER (${orderByClause}) AS RowNum
    FROM (${queryWithoutOrderBy}) AS OriginalQuery
    ${searchQuery}
  )
  SELECT *
  FROM PaginatedResults
  WHERE RowNum BETWEEN ${offset + 1} AND ${offset + itemsPerPage}
  ORDER BY RowNum;
  `;
  return paginatedQuery
}

export function buildCountQuery({ sqlQuery }) {
  const cleanSqlQuery = sqlQuery.replace(/;\s*$/, '')
  const queryWithout = cleanSqlQuery.replace(/ORDER BY.*$/i, '').trim()
  const countQuery = `SELECT COUNT(*) AS totalCount FROM (${queryWithout}) AS subquery`
  return countQuery
}


export const ITEMS_PER_PAGE = 5
export const PAGE_NUMBER = 1
export const GRAPH_ITEMS_PER_PAGE = 100

export function transformedColumns({ columns }) {
  return Object.keys(columns).map(columnName => {
    return {
      name: columnName,
      type: columns[columnName].type.toString().split(' ')?.[0]
    }
  })
}
