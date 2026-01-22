import React from 'react';
import { FaCheck } from 'react-icons/fa';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const stepNumber = index + 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-secondary text-white'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary ring-opacity-20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <FaCheck size={14} /> : stepNumber}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    isCurrent || isCompleted
                      ? 'text-text-dark'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors duration-200 ${
                  isCompleted ? 'bg-secondary' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;







