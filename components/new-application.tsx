'use client';
import React, { useState } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { db } from '../services/browser-client/db';
import { toast } from 'sonner';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import { Field, FieldGroup, FieldLabel, FieldSet } from './ui/field';
import { MainContainer } from './custom/main-container';

export default function NewApplicationView() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !rawText) {
      toast.error('Please fill in title and job description.');
      return;
    }

    setIsLoading(true);
    try {
      const jobId = await db.saveJob({
        title,
        company,
        raw_text: rawText,
      });
      toast.success('Job saved successfully! Generating application...');
      router.push(`/application-package/${jobId}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <div className='mb-5 flex items-center gap-3'>
        <div className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600'>
          <Briefcase size={16} />
        </div>
        <div>
          <h1 className='text-lg font-bold text-slate-900'>Target a New Job</h1>
          <p className='text-slate-500 mt-0.5 text-xs'>
            Paste the job description to generate tailored documents.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <div className='grid grid-cols-2 gap-4'>
                <Field>
                  <FieldLabel htmlFor='title'>Job Title</FieldLabel>
                  <Input
                    id='title'
                    type='text'
                    placeholder='e.g. Senior Product Designer'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='company'>Company (Optional)</FieldLabel>
                  <Input
                    id='company'
                    type='text'
                    placeholder='e.g. Acme Corp'
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor='description'>
                  Job Description Text
                </FieldLabel>
                <Textarea
                  id='description'
                  className='min-h-[250px]'
                  placeholder='Paste the full job description here...'
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className='pt-2'>
            <Button
              className='w-fit'
              onClick={handleSubmit}
              disabled={isLoading}
              size='lg'
              variant='default'>
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  {'Generate Application Package '}
                  <ArrowRight className='ml-2 h-3.5 w-3.5' />{' '}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
