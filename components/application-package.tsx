'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, MoreHorizontalIcon } from 'lucide-react';
import { db } from '../services/browser-client/db';
import { generateApplicationPackage } from '../services/gemini';
import { JobDescription, UserProfile } from '@/types/db';
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
import { WritingTone } from '@/types/ai';
import { ApplicationWithDetails } from '@/types/join';

export default function ApplicationPackageView({
  profile,
  job,
  generatedApplication,
}: {
  profile: UserProfile;
  job: JobDescription;
  generatedApplication: ApplicationWithDetails | undefined;
}) {
  const [application, setApplication] = useState<
    ApplicationWithDetails | undefined
  >(generatedApplication);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const [selectedTone, setSelectedTone] = useState<WritingTone>('professional');

  useEffect(() => {
    if (job && profile && !application && !isGenerating) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, profile, application]);

  const handleGenerate = async () => {
    if (!job.id || !profile.id) return;
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const result = await generateApplicationPackage(
        profile,
        job,
        selectedTone
      );

      const cvId = await db.saveTailoredCV(profile.user_id, {
        summary: result?.tailored_cv_data?.summary || '',
        experience: result?.tailored_cv_data?.experience || [],
        education: result?.tailored_cv_data?.education || [],
        achievements: result?.tailored_cv_data?.achievements || [],
        skills: result?.tailored_cv_data?.skills || [],
      });
      setGenerationStep(1);

      const chatTitle = `Chat for ${job.title}`;
      const newChatId = await db.startNewChat(chatTitle);
      setGenerationStep(2);

      await db.saveApplicationPackage(job.id, profile.id, cvId, newChatId, {
        cover_letter_markdown: result?.cover_letter_markdown || '',
      });
      setGenerationStep(3);

      const savedApp = await db.getApplicationWithDetails(job.id);
      setApplication(savedApp);

      clearInterval(stepInterval);
      setGenerationStep(4);

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
                <RefreshCw className='mr-1 h-4 w-4' /> Regenerate
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon-sm' aria-label='More Options'>
                    <MoreHorizontalIcon className='h-4 w-4' />
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
              <TailoredCV
                userProfile={profile}
                tailorCV={application.tailored_cv}
                job={job}
                onSave={async (updatedCV) => {
                  // Update the application state with the new CV data
                  const updatedApplication = {
                    ...application,
                    tailored_cv_data: updatedCV,
                  };
                  setApplication(updatedApplication);
                  await db.saveTailoredCV(
                    application.tailored_cv.id,
                    updatedCV
                  );
                  toast.success('Tailored CV updated successfully!');
                }}
              />
            </TabsContent>
            <TabsContent value='cover'>
              <CoverLetter
                application={application}
                job={job}
                onSave={async (updatedMarkdown) => {
                  // Update the application state with the new cover letter markdown
                  const updatedApplication = {
                    ...application,
                    cover_letter_markdown: updatedMarkdown,
                  };
                  setApplication(updatedApplication as ApplicationWithDetails);
                  await db.saveApplicationPackage(
                    application.job_id,
                    application.user_id,
                    application.tailored_cv_id || '',
                    application.chat_id,
                    { cover_letter_markdown: updatedMarkdown }
                  );
                  toast.success('Cover Letter updated successfully!');
                }}
              />
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
