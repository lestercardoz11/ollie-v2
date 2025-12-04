import { Copy, Download, Edit2, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { GeneratedApplication, JobDescription } from '@/types/db';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { generateCoverLetterPDF } from '@/utils/cover-letter';
import { Card } from '../ui/card';
import { ButtonGroup } from '../ui/button-group';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { Label } from '../ui/label';
import { FieldGroup, FieldSet } from '../ui/field';

export const CoverLetter = ({
  application,
  job,
  onSave,
}: {
  application: GeneratedApplication;
  job: JobDescription;
  onSave?: (updatedMarkdown: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(
    application.cover_letter_markdown || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const currentContent = isEditing
    ? editedContent
    : application.cover_letter_markdown || '';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  const handleDownloadCL = async () => {
    if (!application || !job) return;
    try {
      await generateCoverLetterPDF(
        currentContent,
        `CoverLetter_${job.company.replace(/\s/g, '_')}.pdf`
      );
      toast.success('Cover Letter PDF downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  const handleEdit = () => {
    setEditedContent(application.cover_letter_markdown || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!onSave) {
      toast.error('Save functionality not configured');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editedContent);
      setIsEditing(false);
      toast.success('Cover letter updated successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(application.cover_letter_markdown || '');
    setIsEditing(false);
  };

  return (
    <Card className='relative p-8'>
      {!isEditing ? (
        <>
          <ScrollArea className='h-[600px] pr-4'>
            <div className='prose prose-sm prose-slate max-w-none'>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className='text-2xl font-bold mb-4 text-slate-900'>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className='text-xl font-semibold mt-6 mb-3 text-slate-800'>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className='text-lg font-semibold mt-4 mb-2 text-slate-700'>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className='text-sm leading-relaxed mb-4 text-slate-700 font-serif'>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className='list-disc pl-6 mb-4 space-y-2'>
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className='text-sm text-slate-700 font-serif'>
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className='font-semibold text-slate-900'>
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className='italic text-slate-700'>{children}</em>
                  ),
                }}>
                {currentContent}
              </ReactMarkdown>
            </div>
          </ScrollArea>

          <ButtonGroup className='absolute top-4 right-4'>
            <Button
              variant='secondary'
              size='sm'
              onClick={handleEdit}
              title='Edit cover letter'>
              <Edit2 className='h-4 w-4' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => copyToClipboard(currentContent)}
              title='Copy to clipboard'>
              <Copy className='h-4 w-4' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={handleDownloadCL}
              title='Download as PDF'>
              <Download className='h-4 w-4' />
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <div className='mb-4 pr-32'>
            <h3 className='text-lg font-semibold mb-2'>Edit Cover Letter</h3>
            <p className='text-sm text-slate-600'>
              Edit your cover letter content below. Use Markdown formatting for
              better structure.
            </p>
          </div>

          <ScrollArea className='h-[600px] pr-4'>
            <FieldSet>
              <FieldGroup>
                <Label
                  htmlFor='cover-letter-content'
                  className='text-base font-semibold'>
                  Cover Letter Content (Markdown)
                </Label>
                <Textarea
                  id='cover-letter-content'
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={25}
                  placeholder='Enter your cover letter content here...'
                  className='resize-none font-mono text-sm'
                />
                <p className='text-xs text-slate-500 mt-2'>
                  Tip: Use **bold** for emphasis, *italic* for subtle emphasis,
                  and line breaks to separate paragraphs.
                </p>
              </FieldGroup>

              <div className='mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200'>
                <h4 className='text-sm font-semibold mb-3 text-slate-700'>
                  Live Preview
                </h4>
                <div className='prose prose-sm prose-slate max-w-none'>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className='text-2xl font-bold mb-4 text-slate-900'>
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className='text-xl font-semibold mt-6 mb-3 text-slate-800'>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className='text-lg font-semibold mt-4 mb-2 text-slate-700'>
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className='text-sm leading-relaxed mb-4 text-slate-700 font-serif'>
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className='list-disc pl-6 mb-4 space-y-2'>
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className='text-sm text-slate-700 font-serif'>
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className='font-semibold text-slate-900'>
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className='italic text-slate-700'>{children}</em>
                      ),
                    }}>
                    {editedContent || '*Your preview will appear here...*'}
                  </ReactMarkdown>
                </div>
              </div>
            </FieldSet>
          </ScrollArea>

          <ButtonGroup className='absolute top-4 right-4'>
            <Button
              variant='default'
              size='sm'
              onClick={handleSave}
              disabled={isSaving}
              title='Save changes'>
              <Save className='h-4 w-4 mr-1' />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleCancel}
              disabled={isSaving}
              title='Cancel editing'>
              <X className='h-4 w-4 mr-1' />
              Cancel
            </Button>
          </ButtonGroup>
        </>
      )}
    </Card>
  );
};
