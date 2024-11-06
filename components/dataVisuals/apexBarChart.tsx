'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexBarChart = ({ labels, series }) => {
  const chartWidth = labels.length * 50

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      width: chartWidth
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels
    },
    yaxis: {
      title: {
        text: ''
      }
    },
    fill: {
      opacity: 1
    }
  }

  const seriesList = [
    {
      name: '',
      data: series
    }
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: chartWidth }}>
        <Chart options={options} series={seriesList} type="bar" height={450} />
      </div>
    </div>
  )
}

export default ApexBarChart
