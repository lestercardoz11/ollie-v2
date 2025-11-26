import { CheckCircle2, Sparkles } from 'lucide-react';
import { Spinner } from '../ui/spinner';

export const GenerationProgress = ({
  generationStep,
}: {
  generationStep: number;
}) => {
  const steps = [
    'Analyzing Job Description...',
    'Matching Skills & Experience...',
    'Drafting Tailored Content...',
    'Finalizing Polish...',
  ];

  return (
    <div className='flex-1 flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl border border-slate-200 shadow-sm'>
      <div className='flex flex-col items-center justify-center space-y-6 max-w-xs w-full'>
        <div className='w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center relative mb-4'>
          <div className='absolute inset-0 border-4 border-blue-100 rounded-full'></div>
          <div className='absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin'></div>
          <Sparkles size={28} className='animate-pulse' />
        </div>

        <div className='w-full space-y-3'>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3 transition-all duration-500'
              style={{ opacity: idx <= generationStep ? 1 : 0.3 }}>
              {idx < generationStep ? (
                <div className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white'>
                  <CheckCircle2 size={12} />
                </div>
              ) : idx === generationStep ? (
                <div className='w-5 h-5 flex items-center justify-center'>
                  <Spinner />
                </div>
              ) : (
                <div className='w-5 h-5 border-2 border-slate-200 rounded-full'></div>
              )}
              <span
                className={`text-xs font-medium ${
                  idx === generationStep
                    ? 'text-blue-700'
                    : idx < generationStep
                    ? 'text-slate-900'
                    : 'text-slate-400'
                }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
