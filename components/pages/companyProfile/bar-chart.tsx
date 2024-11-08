import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function WeeklyControlHighGainChart({ data }) {
  // Transform the data to create separate series for Control, Grain Supplement, Silage Supplement, and High-Grain
  const controlData = []
  const grainSupplementData = []
  const silageSupplementData = []
  const highGrainData = [] // New array for High-Grain data

  // Initialize data for each week to ensure we have 4 weeks on the chart
  const weeks = [1, 4, 8, 12] // Set your 4-week intervals

  weeks.forEach(week => {
    const controlWeekData = data[0].find(
      item => item.Week === week && item.Treatment_Type === 'Control'
    )
    const grainSupplementWeekData = data[0].find(
      item => item.Week === week && item.Treatment_Type === 'Grain Supplement'
    )
    const silageSupplementWeekData = data[0].find(
      item => item.Week === week && item.Treatment_Type === 'Silage Supplement'
    )
    const highGrainWeekData = data[0].find(
      item => item.Week === week && item.Treatment_Type === 'High-Grain'
    )

    controlData.push(controlWeekData ? controlWeekData.Avg_Milk_Yield : 0)
    grainSupplementData.push(
      grainSupplementWeekData ? grainSupplementWeekData.Avg_Milk_Yield : 0
    )
    silageSupplementData.push(
      silageSupplementWeekData ? silageSupplementWeekData.Avg_Milk_Yield : 0
    )
    highGrainData.push(highGrainWeekData ? highGrainWeekData.Avg_Milk_Yield : 0)
  })

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 250,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 600
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'flat',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Week 1', 'Week 4', 'Week 8', 'Week 12']
    },
    yaxis: {
      show: true,

      labels: {
        formatter: function (val) {
          return val.toFixed(2)
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)} gals`
        }
      }
    },
    colors: ['#003366', '#FFD700', '#90EE90', '#00E396'],
    legend: {
      position: 'top'
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 5
    }
  }

  // Conditionally include series only if they have data
  const series = [
    {
      name: 'Control(Gal/day)',
      data: controlData
    }
  ]

  if (grainSupplementData.some(value => value > 0)) {
    series.push({
      name: 'Grain Supplement(gal/day)',
      data: grainSupplementData
    })
  }

  if (silageSupplementData.some(value => value > 0)) {
    series.push({
      name: 'Silage Supplement(gal/day)',
      data: silageSupplementData
    })
  }

  if (highGrainData.some(value => value > 0)) {
    series.push({
      name: 'High-Grain(Gal/day)',
      data: highGrainData
    })
  }

  return (
    <div className="w-full  mx-0 p-0">
      <div>
        Milk Yield over Time (
        {data[0].some(item => item.Treatment_Type === 'Silage Supplement')
          ? '(MLK102: Rotational Grazing & Supplementary Feeding)'
          : 'MLK101'}
        )
      </div>
      <div className="bg-white p-0 w-full">
        <Chart
          options={options}
          series={series}
          type="bar"
          height={250}
          width="100%"
        />
      </div>
    </div>
  )
}
