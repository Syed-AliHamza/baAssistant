'use client'

import { AGENTS } from '@/lib/utils/constants'
import React from 'react'

const SelectionBoxes = ({ selected, setSelected }) => {
  const handleSelect = (option: string) => {
    setSelected(option)
  }

  return (
    <div className="flex  justify-center ">
      <div className="flex flex-row space-x-4 p-4 h-15 w-4/5">
        <div
          className={`w-full text-center rounded-lg cursor-pointer border ${
            selected === 'Panda'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-black border-gray-300'
          }`}
          onClick={() => handleSelect(AGENTS.PANDA)}
        >
          Panda
        </div>

        <div
          className={`w-full text-center rounded-lg cursor-pointer border ${
            selected === 'Research Studies'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-black border-gray-300'
          }`}
          onClick={() => handleSelect(AGENTS.RESEARCH_STUDIES)}
        >
          Research Studies
        </div>

        <div
          className={`w-full text-center rounded-lg cursor-pointer border ${
            selected === 'AI Intern'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-black border-gray-300'
          }`}
          onClick={() => handleSelect(AGENTS.AI_INTERN)}
        >
          AI Intern
        </div>
      </div>
    </div>
  )
}

export default SelectionBoxes
