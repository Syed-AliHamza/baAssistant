import React from 'react'

const AssumptionExplanationSection = ({ assumption, explanation }) => {
  return (
    <div>
      {assumption && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Assumptions</h2>
          <p className="text-muted-foreground">{assumption}</p>
        </div>
      )}
      {explanation && (
        <div className="space-y-2 mt-2">
          <h2 className="text-xl font-bold">Explanation</h2>
          <p className="text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  )
}

export default AssumptionExplanationSection
