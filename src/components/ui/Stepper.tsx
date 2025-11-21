/**
 * Stepper Component
 * Indicador visual de progresso multi-step
 */

import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full px-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-medical-600 dark:bg-medical-500 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${
                      isCompleted
                        ? "bg-medical-600 dark:bg-medical-500 text-white"
                        : isCurrent
                          ? "bg-medical-600 dark:bg-medical-500 text-white ring-4 ring-medical-100 dark:ring-medical-900"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>

                {/* Label */}
                <div className="mt-2 text-center max-w-[140px]">
                  <p
                    className={`text-sm font-medium whitespace-nowrap ${
                      isCurrent
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
