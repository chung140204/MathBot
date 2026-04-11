'use client';

interface Step {
  id: number;
  content: string;
}

interface StepListProps {
  steps: Step[];
}

export default function StepList({ steps }: StepListProps) {
  return (
    <div className="space-y-4 my-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white text-xs font-bold shadow-sm mt-0.5">
            {step.id}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{step.content}</p>
        </div>
      ))}
    </div>
  );
}
