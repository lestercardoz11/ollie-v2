import { Copy, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { GeneratedApplication, JobDescription, UserProfile } from '@/types/db';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { ButtonGroup } from '../ui/button-group';
import { downloadResume } from '@/utils/resume';

export const TailoredCV = ({
  userProfile,
  application,
  job,
}: {
  userProfile: UserProfile;
  application: GeneratedApplication;
  job: JobDescription;
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  const handleDownloadCV = async () => {
    if (!application || !job) return;
    try {
      await downloadResume(
        userProfile,
        `Resume_${job.company.replace(/\s/g, '_')}.pdf`
      );
      toast.success('Resume PDF downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <Card className='relative p-8'>
      <ScrollArea className='h-full prose prose-sm prose-slate max-w-none text-xs leading-relaxed font-serif'>
        <ReactMarkdown>{application.tailored_cv_id}</ReactMarkdown>
      </ScrollArea>
      <ButtonGroup className='absolute top-4 right-4'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => {
            copyToClipboard(application.tailored_cv_id || '');
          }}>
          <Copy />
        </Button>

        <Button variant='secondary' size='sm' onClick={handleDownloadCV}>
          <Download />
        </Button>
      </ButtonGroup>
    </Card>
  );
};
