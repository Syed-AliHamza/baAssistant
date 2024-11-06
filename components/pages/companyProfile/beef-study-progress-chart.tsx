'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function BeefStudyProgressChart() {
  const [timeRange, setTimeRange] = useState('3months')

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        dataLabels: {
          position: 'bottom'
        }
      }
    },
    colors: ['#2196F3', '#2196F3', '#2196F3', '#2196F3'],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return labels[opt.dataPointIndex]
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: ['BC501', 'CF717', 'BC 500', 'CF718'],
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      }
    }
  }

  const labels = ['8/8 weeks', '10/10 weeks', '24/24 weeks', '6/6 weeks']

  const series = [
    {
      name: 'Progress',
      data: [50, 70, 80, 40]
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
        <CardTitle className="text-[#524E53] font-inter text-2xl font-semibold">
          Study Progress Bar (Timeline)
        </CardTitle>
        <Select value={timeRange} onValueChange={value => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <Chart
            options={{
              ...chartOptions,
              xaxis: {
                ...chartOptions.xaxis
              }
            }}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </CardContent>
    </Card>
  )
}
