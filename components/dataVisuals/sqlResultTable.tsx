'use client'

import { useState } from 'react'
import { MyTable } from '../table/table'
import { useActions } from 'ai/rsc'

import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash'

export const sanitizeData = ({ data }) =>
  data?.map(row => {
    return Object.fromEntries(
      Object.entries(row)
        .filter(([key]) => key !== 'RowNum')
        .map(([key, value]) => {
          if (typeof value === 'string' && !isNaN(value)) {
            value = Number(value).toFixed(0)
          } else if (typeof value === 'number') {
            value = value.toFixed(0)
          }

          return [key, value]
        })
    )
  })

export function SQLResultTable({ data = [], query, totalCount, columns = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const firstColumn = columns?.find(col => {
    return col.type.includes('NVarChar') || col.type.includes('VarChar')
  })

  useQuery({
    queryKey: ['tabledata', query, searchTerm, currentPage],
    queryFn: async () => {
      const response = await fetchPaginatedData({
        sqlQuery: query,
        pageNumber: currentPage,
        searchTerm: searchTerm,
        column: firstColumn
      })
      const sanitizedResponse = sanitizeData({ data: response })
      setTableData(sanitizedResponse)
      return sanitizedResponse
    }
  })

  const [tableData, setTableData] = useState(sanitizeData({ data }))
  const { fetchPaginatedData } = useActions()

  const handleSearch = debounce(e => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }, 500)

  const handlePageChange = async page => {
    setLoading(page)
    const data = await fetchPaginatedData({ sqlQuery: query, pageNumber: page })
    setLoading(false)

    setTableData(sanitizeData({ data }))
    setCurrentPage(page)
    setSearchTerm('')
  }

  return (
    <div className="max-w-[650px] xs:w-[220px]">
      <div className="space-y-4 pace-y-4 mt-4">
        <MyTable
          filteredData={tableData}
          handleSearch={handleSearch}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          setItemsPerPage={setItemsPerPage}
          totalCount={totalCount}
          loading={loading}
          firstColumn={firstColumn}
        />
      </div>

      {/* <div className="flex flex-col sm:flex-row items-start gap-2 mt-6">
        {exampleMessages.map((suggestion, index) => (
          <button
            key={suggestion.subheading + index + 1}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
            onClick={async () => {
              const response = await submitUserMessage(suggestion.message, [])
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response
              ])
            }}
          >
            <SparklesIcon />
            {suggestion.subheading}
          </button>
        ))}
      </div> */}
    </div>
  )
}
