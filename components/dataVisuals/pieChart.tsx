import dynamic from 'next/dynamic'
import React from 'react'
import { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const generateRandomColors = (numColors: number) => {
  return Array.from({ length: numColors }, () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    return `#${randomColor.padStart(6, '0')}`
  })
}

const PieChart = ({ series, labels }) => {
  const predefinedColors = [
    '#008FFB',
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0'
  ]

  const additionalColors =
    labels.length > predefinedColors.length
      ? generateRandomColors(labels.length - predefinedColors.length)
      : []

  const colors = [...predefinedColors, ...additionalColors]

  const options: ApexOptions = {
    chart: {
      type: 'pie'
    },
    labels: labels,
    colors: colors.slice(0, labels.length),
    title: {
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="pie" />
    </div>
  )
}

export default PieChart
