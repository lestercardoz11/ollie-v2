import React, { useMemo, useCallback } from 'react';
import { ChevronRight, Percent } from 'lucide-react';
import { JobDescription } from '@/lib/types';

interface JobRowProps {
  job: JobDescription;
  hasApp: boolean;
  score: number;
  scoreColorClass: string;
  onNavigate: (id: string) => void;
}

const JobRow = React.memo<JobRowProps>(
  ({ job, hasApp, score, scoreColorClass, onNavigate }) => {
    const formattedDate = useMemo(
      () =>
        new Date(job.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
      [job.createdAt]
    );

    const handleClick = useCallback(() => {
      onNavigate(job.id);
    }, [job.id, onNavigate]);

    return (
      <div
        className='px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer group'
        onClick={handleClick}>
        <div className='flex items-center gap-3 min-w-0'>
          <div
            className={`w-2 h-2 shrink-0 rounded-full ${
              hasApp ? 'bg-emerald-400' : 'bg-slate-300'
            }`}
          />
          <div className='truncate'>
            <h4 className='font-medium text-slate-900 text-xs truncate'>
              {job.title}
            </h4>
            <p className='text-[10px] text-slate-500 truncate'>
              {job.company || 'Unknown Company'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4 sm:gap-6 shrink-0'>
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${scoreColorClass}`}>
            <Percent size={10} />
            <span className='text-[10px] font-bold'>{score}</span>
          </div>

          <span className='text-[10px] text-slate-400 hidden sm:block min-w-[60px] text-right'>
            {formattedDate}
          </span>
          <div className='flex items-center gap-2'>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border hidden sm:inline-block ${
                hasApp
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
              {hasApp ? 'Generated' : 'Draft'}
            </span>
            <ChevronRight className='h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors' />
          </div>
        </div>
      </div>
    );
  }
);

JobRow.displayName = 'JobRow';
export default JobRow;
