import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function WeeklyControlHighStudyChart({ data }) {
  const hasTreatmentType = data[0].some(item => item.Cow_Type)
  const chartTitle = hasTreatmentType
    ? 'Average milk fat % & Milk yield'
    : 'Feed Comparison & impact on average milk yield & average lactation duration (MLK103)'
  let categories = []
  let series = [
    { name: 'Avg Milk Yield(Gallans/day)', data: [] },
    { name: 'Avg Milk Fat Percentage', data: [] }
  ]

  const cowData = data[0]

  if (cowData && cowData.length > 0 && cowData[0].Cow_Type) {
    categories = [...new Set(cowData.map(item => item.Cow_Type))]
    series[0].data = cowData.map(item => item.Avg_Milk_Yield || 0)
    series[1].data = cowData.map(item => item.Avg_Milk_Fat_Percentage || 0)
  } else {
    const feedData = data[0]
    categories = [...new Set(feedData.map(item => item.Feed_Type))]
    series[0].data = feedData.map(item => item.Avg_Milk_Yield || 0)
    series = [
      {
        name: 'Avg Milk Yield(gal/day)',
        data: feedData.map(item => item.Avg_Milk_Yield || 0)
      },
      {
        name: 'Avg Lactation Duration(days)',
        data: feedData.map(item => item.Avg_Lactation_Duration || 0)
      }
    ]
  }

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
      categories
    },
    yaxis: {
      show: true,
      labels: {
        show: true
      },
      title: {
        text: undefined
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString()
        }
      }
    },
    colors: ['#32CD32', '#1E90FF'],
    legend: {
      position: 'top'
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 5
    }
  }

  return (
    <div className="w-full  mx-0 p-0">
      <div>{chartTitle}</div>
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
