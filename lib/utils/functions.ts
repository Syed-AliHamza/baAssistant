import { SpinnerState } from '../types'

export function updateSpinnerState(
  currentState: SpinnerState,
  newStepId: string,
  newStepText: string
): SpinnerState {
  // Mark previous step as completed
  const updatedSteps = currentState.steps.map(step => ({
    ...step,
    isCompleted: step.id === currentState.currentStep ? true : step.isCompleted
  }))

  // Add new step if it doesn't exist
  if (!updatedSteps.find(step => step.id === newStepId)) {
    updatedSteps.push({
      id: newStepId,
      text: newStepText,
      isCompleted: false
    })
  }

  return {
    steps: updatedSteps,
    currentStep: newStepId
  }
}
