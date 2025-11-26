import { Copy, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { GeneratedApplication, JobDescription } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { generateCoverLetterPDF } from '@/services/pdfGenerator';
import { Card } from '../ui/card';
import { ButtonGroup } from '../ui/button-group';
import { ScrollArea } from '../ui/scroll-area';

export const CoverLetter = ({
  application,
  job,
}: {
  application: GeneratedApplication;
  job: JobDescription;
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  const handleDownloadCL = async () => {
    if (!application || !job) return;
    try {
      await generateCoverLetterPDF(
        application.coverLetter,
        `CoverLetter_${job.company.replace(/\s/g, '_')}.pdf`
      );
      toast.success('Cover Letter PDF downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <Card className='relative p-8'>
      <ScrollArea className='h-full prose prose-sm prose-slate max-w-none text-xs leading-relaxed font-serif'>
        <ReactMarkdown>{application.coverLetter}</ReactMarkdown>
      </ScrollArea>
      <ButtonGroup className='absolute top-4 right-4'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => {
            copyToClipboard(application.coverLetter);
          }}>
          <Copy />
        </Button>

        <Button variant='secondary' size='sm' onClick={handleDownloadCL}>
          <Download />
        </Button>
      </ButtonGroup>
    </Card>
  );
};
