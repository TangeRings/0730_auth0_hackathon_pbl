import React from "react";
import { DemoStep } from "../types";
import { Check, BookOpen, Sparkles, FileCheck, Award, CreditCard } from "lucide-react";

interface Props {
  currentStep: DemoStep;
  onSelectStep: (step: DemoStep) => void;
  isPublished: boolean;
}

type StepDef = {
  key: DemoStep;
  label: string;
  number: number;
  icon: React.ReactNode;
};

export const DemoProgress: React.FC<Props> = ({ currentStep, onSelectStep, isPublished }) => {
  const steps: StepDef[] = [
    { key: "course", label: "Course Input", number: 1, icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: "project", label: "AI Project", number: 2, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: "evidence", label: "Student Evidence", number: 3, icon: <FileCheck className="w-3.5 h-3.5" /> },
    { key: "portfolio", label: "Portfolio", number: 4, icon: <Award className="w-3.5 h-3.5" /> },
    { key: "plan", label: "Verify & Publish", number: 5, icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  const getStepIndex = (step: DemoStep) => steps.findIndex((s) => s.key === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full bg-white border-b border-slate-200/80 px-4 py-3 shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.key;
          const isCompleted = idx < currentIndex || (step.key === "plan" && isPublished);

          return (
            <React.Fragment key={step.key}>
              <button
                onClick={() => onSelectStep(step.key)}
                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs"
                    : isCompleted
                    ? "text-slate-700 hover:bg-slate-50"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.number}
                </div>
                <span className="whitespace-nowrap">{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 min-w-4 flex-1 max-w-12 transition-all rounded-full ${
                    idx < currentIndex ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
