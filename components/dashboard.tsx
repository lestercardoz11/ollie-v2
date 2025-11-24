'use client';

import React, { useMemo, useCallback } from 'react';
import { Plus, FileText, Clock, Activity } from 'lucide-react';
import { JobDescription, GeneratedApplication, UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { PageTransition } from '@/components/custom/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobRow from './dashboard/job-row';
import StatCard from './dashboard/stat-card';

interface DashboardClientProps {
  jobs: JobDescription[];
  apps: GeneratedApplication[];
  profile: UserProfile | null;
}

export default function DashboardView({
  jobs,
  apps,
  profile,
}: DashboardClientProps) {
  const router = useRouter();

  const calculateMatchScore = useCallback(
    (job: JobDescription, userProfile: UserProfile | null): number => {
      if (!userProfile) return 0;

      let score = 10;
      const jobTextLower = job.rawText.toLowerCase();
      const jobTitleLower = job.title.toLowerCase();

      const titleKeywords = jobTitleLower
        .split(/\s+/)
        .filter((w) => w.length > 3);

      const hasRelevantExperience = userProfile.experience.some((exp) => {
        const roleLower = exp.role.toLowerCase();
        return titleKeywords.some((k) => roleLower.includes(k));
      });

      if (hasRelevantExperience) score += 25;

      const allSkills = [
        ...userProfile.skills.technical,
        ...userProfile.skills.soft,
        ...userProfile.skills.keywords,
      ];

      if (allSkills.length > 0) {
        const matchedSkills = allSkills.filter((skill) =>
          jobTextLower.includes(skill.toLowerCase())
        );
        score += Math.min(matchedSkills.length * 5, 60);
      }

      return Math.min(score, 98);
    },
    []
  );

  const getScoreColor = useCallback((score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  }, []);

  const jobsWithMetadata = useMemo(() => {
    return jobs.map((job) => {
      const hasApp = apps.some((a) => a.jobId === job.id);
      const score = calculateMatchScore(job, profile);
      const scoreColorClass = getScoreColor(score);

      return {
        job,
        hasApp,
        score,
        scoreColorClass,
      };
    });
  }, [jobs, apps, profile, calculateMatchScore, getScoreColor]);

  const avgScore = useMemo(() => {
    if (jobs.length === 0) return 0;
    const total = jobsWithMetadata.reduce((acc, { score }) => acc + score, 0);
    return Math.round(total / jobs.length);
  }, [jobsWithMetadata, jobs.length]);

  const timeSaved = useMemo(
    () => (jobs.length * 1.5).toFixed(1),
    [jobs.length]
  );

  const handleNavigateToJob = useCallback(
    (jobId: string) => {
      router.push(`/application/${jobId}`);
    },
    [router]
  );

  const handleNewApplication = useCallback(() => {
    router.push('/new-job');
  }, [router]);

  return (
    <PageTransition className='space-y-5 pb-10'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-lg font-bold text-slate-900'>Overview</h1>
          <p className='text-slate-500 text-xs'>
            Your job search performance at a glance.
          </p>
        </div>
        <Button onClick={handleNewApplication} size='sm' variant='default'>
          <Plus className='mr-1.5 h-3.5 w-3.5' /> New Application
        </Button>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          icon={<FileText size={18} />}
          label='Applications'
          value={jobs.length}
          bgColor='bg-blue-50'
          textColor='text-blue-600'
        />
        <StatCard
          icon={<Clock size={18} />}
          label='Time Saved'
          value={`${timeSaved}h`}
          bgColor='bg-emerald-50'
          textColor='text-emerald-600'
        />
        <StatCard
          icon={<Activity size={18} />}
          label='Avg Match Score'
          value={`${avgScore}%`}
          bgColor='bg-purple-50'
          textColor='text-purple-600'
        />
      </div>

      {/* Recent Applications */}
      <Card className='border-slate-200'>
        <CardHeader className='px-5 py-3 border-b border-slate-100'>
          <CardTitle className='text-sm'>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className='divide-y divide-slate-50'>
              {jobsWithMetadata.map(
                ({ job, hasApp, score, scoreColorClass }) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    hasApp={hasApp}
                    score={score}
                    scoreColorClass={scoreColorClass}
                    onNavigate={handleNavigateToJob}
                  />
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </PageTransition>
  );
}

const EmptyState = React.memo(() => (
  <div className='text-center py-12 text-slate-400 text-xs'>
    {`No applications yet. Click "New Application" to start.`}
  </div>
));
EmptyState.displayName = 'EmptyState';
