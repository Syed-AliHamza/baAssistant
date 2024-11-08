'use client'

import { remark } from 'remark'
import remarkHtml from 'remark-html'

import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

export function markdownToHtmlTable(markdown) {
  // Split the markdown into lines
  const lines = markdown.split('\n')

  // Initialize variables to hold table parts
  let table = '<table border="1"><thead><tr>'

  // Process the header row (first line)
  const headers = lines[0]
    .split('|')
    .map(header => header.trim())
    .filter(header => header)
  headers.forEach(header => {
    table += `<th>${header}</th>`
  })

  table += '</tr></thead><tbody>'

  // Process the data rows
  for (let i = 2; i < lines.length; i++) {
    // Start from the 3rd line to skip the separator
    const row = lines[i]
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell)
    if (row.length > 0) {
      table += '<tr>'
      row.forEach(cell => {
        table += `<td>${cell}</td>`
      })
      table += '</tr>'
    }
  }

  table += '</tbody></table>'
  return table
}

export function htmlToMarkdown(htmlText: string) {
  const file = remark()
    .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(htmlText)

  return String(file)
}
