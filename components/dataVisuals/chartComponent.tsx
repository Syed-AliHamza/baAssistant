'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { sanitizeData } from '@/components/dataVisuals/sqlResultTable'
import ApexBarChart from '@/components/dataVisuals/apexBarChart'
import { downloadDocument } from '@/components/dataVisuals/helpers'
import PieChart from './pieChart'

export function ChartComponent({
  graphData,
  typeOfChart,
  query,
  assumptions,
  explanation,
  tableData,
  xAxisProperty,
  yAxisProperty
}) {
  const chartRef = useRef(null)
  const pieChartRef = useRef(null)
  const sanitizedGraphData = sanitizeData({ data: graphData || [] })
  const series = sanitizedGraphData?.map(row => {
    let value = row[yAxisProperty]

    if (typeof value === 'string') {
      value = Number(value)
    }

    return value
  })
  const labels = sanitizedGraphData?.map(row => {
    const value = row[xAxisProperty]

    if (value === null) {
      return 'Unknown'
    }

    const isValidDate =
      typeof value === 'string' && isNaN(value) && !isNaN(Date.parse(value))

    return isValidDate
      ? new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })
      : value
  })

  return (
    <div>
      {labels?.length > 0 &&
        labels?.some(value => !!value) &&
        series.some(value => !!value) &&
        typeOfChart === 'bar' && (
          <>
            <div className="mt-10 mb-2">
              <h2 className="text-xl font-bold">
                Comparison of Data Across Categories
              </h2>
            </div>
            <div ref={chartRef}>
              <ApexBarChart labels={labels} series={series} />
            </div>
          </>
        )}

      {labels?.length > 0 &&
        !(labels?.length > 25) &&
        labels?.some(value => !!value) &&
        series.some(value => !!value) &&
        typeOfChart === 'bar' && (
          <>
            <div className="mt-10 mb-2">
              <h2 className="text-xl font-bold">Proportional Share of Data</h2>
            </div>
            <div ref={pieChartRef}>
              <PieChart series={series} labels={labels} />
            </div>
          </>
        )}

      <Button
        onClick={() =>
          downloadDocument({
            typeOfChart,
            query,
            assumptions,
            explanation,
            filteredData: tableData,
            chartRef,
            pieChartRef
          })
        }
        className="w-full mt-4 bg-[#3B86F7] text-white hover:bg-[#3B86F7] rounded-lg py-2 px-4 flex items-center justify-center transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-2"
        >
          <path d="M4.5 2h15a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20.5V3.5A1.5 1.5 0 0 1 4.5 2zM5 4v16h14V4H5zm2 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
        </svg>
        Download Response
      </Button>
    </div>
  )
}
