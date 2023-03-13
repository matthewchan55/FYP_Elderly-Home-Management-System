import { useState } from "react";

export default function useMultiStepForm(steps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((prevStep) => prevStep + 1);
  }

  function back() {
    setCurrentStepIndex((prevStep) => prevStep - 1);
  }

  function goTo(index){
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    next,
    back,
    goTo
  };
}
