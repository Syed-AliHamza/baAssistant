import React from 'react'
import { CheckIcon, LoaderCircle } from 'lucide-react'
import { StatusStep } from '@/lib/types'

const StatusMessage = ({ steps }: { steps: StatusStep[] }) => {
  return (
    <div className="flex flex-col gap-0 border border-slate-300 rounded-md py-2 mb-2  bg-slate-100">
      {steps.map(step => (
        <div key={step.id} className="group relative flex items-center py-2">
          <div className="flex items-center w-full">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full ml-4 ${
                step.isCompleted ? 'bg-slate-600' : 'bg-slate-400'
              }`}
            >
              {step.isCompleted ? (
                <CheckIcon className="w-3 h-3 text-white" />
              ) : (
                <LoaderCircle className="w-3 h-3 text-white animate-spin" />
              )}
            </div>
            <span className="ml-3 text-sm text-slate-700">{step.text}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatusMessage
