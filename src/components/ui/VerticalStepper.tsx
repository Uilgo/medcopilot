/**
 * VerticalStepper Component
 * Indicador visual de progresso multi-step vertical
 */

import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface VerticalStepperProps {
  steps: Step[];
  currentStep: number;
}

export const VerticalStepper = ({ steps, currentStep }: VerticalStepperProps) => {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} className="flex gap-4">
            {/* Left side - Circle and line */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold transition-all shrink-0 shadow-sm
                  ${
                    isCompleted
                      ? "bg-medical-600 dark:bg-medical-500 text-white shadow-medical-500/20"
                      : isCurrent
                        ? "bg-medical-600 dark:bg-medical-500 text-white ring-4 ring-medical-100 dark:ring-medical-900/50 shadow-lg shadow-medical-500/30"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                  }
                `}
              >
                {isCompleted ? <Check className="h-6 w-6" /> : stepNumber}
              </div>

              {/* Vertical line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-1 flex-1 min-h-[80px] transition-all rounded-full my-2 ${
                    isCompleted
                      ? "bg-medical-600 dark:bg-medical-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>

            {/* Right side - Label and description */}
            <div className={`pb-10 ${index === steps.length - 1 ? "pb-0" : ""}`}>
              <p
                className={`text-lg font-bold mb-1 ${
                  isCurrent
                    ? "text-gray-900 dark:text-white"
                    : isCompleted
                      ? "text-medical-600 dark:text-medical-400"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {step.description && (
                <p
                  className={`text-sm ${
                    isCurrent
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
