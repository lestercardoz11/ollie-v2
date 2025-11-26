'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, MoreHorizontalIcon } from 'lucide-react';
import { db } from '../services/db';
import { generateApplicationPackage } from '../services/geminiService';
import {
  GeneratedApplication,
  JobDescription,
  UserProfile,
  WritingTone,
  QAResponse,
} from '@/lib/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Chat } from './application/chat';
import { TailoredCV } from './application/tailored-cv';
import { CoverLetter } from './application/cover-letter';
import { GenerationProgress } from './application/generation-progress';
import { MainContainer } from './custom/main-container';

export default function ApplicationPackageView({
  profile,
  job,
  generatedApplication,
}: {
  profile: UserProfile;
  job: JobDescription;
  generatedApplication: GeneratedApplication | undefined;
}) {
  const [application, setApplication] = useState<
    GeneratedApplication | undefined
  >(generatedApplication);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Tone Selection
  const [selectedTone, setSelectedTone] = useState<WritingTone>('professional');

  // Auto-generate if no app exists
  useEffect(() => {
    if (job && profile && !application && !isGenerating) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, profile, application]);

  const handleGenerate = async () => {
    if (!job || !profile) return;
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate steps update for UI engagement
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const result = await generateApplicationPackage(
        profile,
        job,
        selectedTone
      );
      clearInterval(stepInterval);
      setGenerationStep(4);

      const newApp: Omit<GeneratedApplication, 'id' | 'createdAt'> = {
        jobId: job.id,
        profileId: profile.id,
        tailoredCv: result?.tailoredCv || '',
        coverLetter: result?.coverLetter || '',
        qaResponses: result?.qaResponses || new Array<QAResponse>(),
      };

      await db.saveApplication(newApp);

      // Refresh application from DB to get ID and created_at
      const savedApp = await db.getApplicationByJobId(job.id);
      setApplication(savedApp);

      toast.success('Application package generated successfully!');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      clearInterval(stepInterval);
      toast.error(err.message || 'AI Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainContainer>
      <Tabs defaultValue='cv'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0'>
          <div className='min-w-0'>
            <h1 className='text-base font-bold text-slate-900 leading-tight truncate'>
              {job.title}
            </h1>
            <p className='text-[10px] text-slate-500 truncate'>{job.company}</p>
          </div>

          <TabsList>
            <TabsTrigger value='cv'>Tailored CV</TabsTrigger>
            <TabsTrigger value='cover'>Cover Letter</TabsTrigger>
            <TabsTrigger value='chat'>AI Career Coach</TabsTrigger>
          </TabsList>

          <div className='flex items-center gap-2'>
            <ButtonGroup>
              <Button
                size={'sm'}
                onClick={handleGenerate}
                disabled={isGenerating}>
                <RefreshCw /> Regenerate
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon-sm' aria-label='More Options'>
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-52'>
                  <DropdownMenuRadioGroup
                    value={selectedTone}
                    onValueChange={(value) =>
                      setSelectedTone(value as WritingTone)
                    }>
                    <DropdownMenuRadioItem value='professional'>
                      Professional
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='confident'>
                      Confident
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='enthusiastic'>
                      Enthusiastic
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='concise'>
                      Concise
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='creative'>
                      Creative
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>

        {isGenerating ? (
          <GenerationProgress generationStep={generationStep} />
        ) : application ? (
          <>
            {/* Content Area */}
            <TabsContent value='cv'>
              <TailoredCV application={application} job={job} />
            </TabsContent>
            <TabsContent value='cover'>
              <CoverLetter application={application} job={job} />
            </TabsContent>
            <TabsContent value='chat'>
              <Chat
                profile={profile}
                job={job}
                application={application}
                selectedTone={selectedTone}
              />
            </TabsContent>
          </>
        ) : (
          <div className='text-center text-slate-500 flex flex-col items-center justify-center h-full'>
            <p className='mb-2 text-xs'>Application content not found.</p>
            <Button onClick={handleGenerate} size='sm'>
              Try Generating
            </Button>
          </div>
        )}
      </Tabs>
    </MainContainer>
  );
}
