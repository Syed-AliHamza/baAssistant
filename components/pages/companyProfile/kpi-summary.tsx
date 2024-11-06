import { fetchAverageDairyMilkYield } from '@/app/actions'
import { Card } from '@/components/ui/card'
import React from 'react'

const Summary = ({ data, title }) => {
  const yieldData = data?.[0] || []

  return (
    <>
      <Card className="col-span-2 lg:col-span-1 m-2 mt-2">
        <div className="flex items-start space-x-5 p-3">{title}</div>
        <div className="grid grid-cols-2 gap-4 px-3">
          {yieldData.map(item => (
            <div key={item.Study_ID} className="flex flex-col ">
              <div className="text-gray-400">{item.Study_ID}</div>
              <div>{item?.Avg_Milk_Yield?.toFixed(1)}</div>
              <div>{item?.Avg_Milk_Fat_Percentage?.toFixed(1)}</div>

              <div>{item?.Study_Duration_Weeks?.toFixed(1)}</div>
              <div>{item?.Lactation_Duration_Days?.toFixed(1)}</div>
              <div>{item?.Avg_Weight_Gain_Per_Day?.toFixed(1)}</div>
              <div>{item?.Feed_Conversion_Ratio?.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

export default Summary
