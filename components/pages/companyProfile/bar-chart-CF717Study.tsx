import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function CaseStudy717Chart({ data }) {
  const filteredData = data
    .flat()
    .filter(item => [1, 4, 8, 12].includes(item.Week))

  const treatments = [
    'Control',
    'High-Grain Feed',
    'Low-Grain, High-Fiber Feed',
    'Supplemented with Omega-3 Fatty Acids'
  ]

  const series = treatments.map(treatment => {
    const treatmentData = filteredData.filter(
      item => item.Treatment === treatment
    )
    const weeklyIntake = [0, 0, 0, 0]

    treatmentData.forEach(item => {
      const weekIndex = [1, 4, 8, 12].indexOf(item.Week)
      if (weekIndex !== -1) {
        weeklyIntake[weekIndex] = item.Feed_Intake_Per_Day
      }
    })

    return {
      name: treatment,
      data: weeklyIntake
    }
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
        show: true
      },
      title: {
        text: 'Feed Intake (Per Day)'
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
    colors: ['#32CD32', '#1E90FF', '#FF6347', '#FFD700'],
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
      <div>Feed Efficiency Over Time (CF717: Optimizing Feed Efficiency)</div>
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
