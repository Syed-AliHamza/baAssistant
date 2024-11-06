'use client'

import { LabelList, Pie, PieChart } from 'recharts'
import { CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

const colorMap = {
  'New Paid Customers': '#0288D1',
  'Low Frequency Paid Customers': '#D32F2F',
  'Medium Frequency Paid Customers': '#F9A825',
  'High Frequency Paid Customers': '#2D8C75',
  'Very High-Value Customers': '#3B86F7'
}
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
const transformChartData = data => {
  return data.map(item => ({
    salesChannel: item.SalesChannel,
    visitors: item.VisitorCount,
    percentage: item.Percentage,
    fill: colorMap[item.SalesChannel] || getRandomColor() // Fallback color in case SalesChannel is not in colorMap
  }))
}

export function PiChartLayout({ distributionChannels }) {
  const chartData = transformChartData(distributionChannels)
  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <div className="block xl:flex items-center">
          <div className="w-full w-xl-[40%]">
            <ul className="list-none">
              {chartData.map((item, index) => (
                <li key={index} className="mb-2">
                  <span
                    className="inline-block size-4 mr-2 rounded-full"
                    style={{
                      backgroundColor: item.fill || '#ccc' // Fallback color in case fill is missing
                    }}
                  ></span>
                  <b>{item.salesChannel}</b>
                  <p>
                    {item.percentage.toFixed()}%, which is {item.visitors}{' '}
                    visitors
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full w-xl-[60%]">
            <ChartContainer className="mx-auto aspect-square">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="salesChannel"
                      valueKey="percentage"
                      hideLabel
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="percentage"
                  nameKey="salesChannel"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="fill"
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="salesChannel"
                    stroke="none"
                    fontSize={12}
                    fill="#fff"
                    formatter={value => {
                      const percentage = chartData
                        .find(d => d.salesChannel === value)
                        ?.percentage.toFixed()
                      return percentage ? ` ${percentage}%` : 'No Data'
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
