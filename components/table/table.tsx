import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { LinkToURL } from '../dataVisuals/link'
import '@/app/globals.css'
import Pagination from '@/components/ui/pagination'

function getColumnNames(rows) {
  if (rows.length === 0) {
    return []
  }
  return Object.keys(rows[0])
}

function formatColumnName(colName) {
  return colName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function MyTable({
  filteredData,
  handleSearch,
  currentPage = 1,
  itemsPerPage = 5,
  onPageChange,
  setItemsPerPage,
  totalCount,
  loading,
  firstColumn
}) {
  const columnNames = getColumnNames(filteredData)

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="max-w-[650px] sm:max-w-[220px]custom-scrollbar-x">
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Query Response</h3>
        <div className="relative px-1">
          <SearchIcon className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            onChange={handleSearch}
            placeholder={`Search ${firstColumn?.name || ''} ...`}
            className="pl-8 w-full"
          />
        </div>
      </div>
      {filteredData?.length > 0 ? (
        <>
          <div
            className="mt-4 p-2 max-h-[800px] overflow-auto space-y-4 custom-scrollbar-x bg-white rounded-xl border"
            style={{
              scrollbarWidth: 'revert',
              scrollbarColor: '#888 #f1f1f1' /* For Firefox */
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {columnNames.map((colName, index) => (
                    <TableHead key={index}>
                      {formatColumnName(colName)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index}>
                    {columnNames.map((colName, colIndex) => {
                      let cellValue = row[colName]
                      let displayValue
                      if (
                        typeof cellValue === 'string' &&
                        cellValue.startsWith('http')
                      ) {
                        displayValue = <LinkToURL url={cellValue} />
                      } else if (
                        Object.prototype.toString.call(cellValue) ===
                        '[object Date]'
                      ) {
                        displayValue = new Date(cellValue).toLocaleDateString()
                      } else {
                        displayValue = String(cellValue)
                      }

                      return (
                        <TableCell key={colIndex}>{displayValue}</TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              loading={loading}
            />
          </div>
        </>
      ) : (
        <div className="border border-dashed rounded-lg p-8 flex items-center justify-center">
          <p className="text-muted-foreground">No data available.</p>
        </div>
      )}
    </div>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
