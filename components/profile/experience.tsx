import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { UserProfile, WorkExperience } from '@/types/db';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field';

export const Experience = ({
  profile,
  setProfile,
  isEditing,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}) => {
  // Experience Handlers
  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        {
          id: Date.now().toString(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        },
        ...prev.experience,
      ],
    }));
  };

  const updateExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const newExp = [...profile.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setProfile({ ...profile, experience: newExp });
  };

  const removeExperience = (index: number) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className='py-0 gap-2 overflow-hidden border-slate-200 shadow-sm'>
      <CardHeader className='bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0 flex flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Briefcase size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Work Experience</CardTitle>
        </div>
        {isEditing && (
          <Button size='icon-sm' variant='ghost' onClick={addExperience}>
            <Plus />
          </Button>
        )}
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4 space-y-4'>
        {profile.experience.map((exp, idx) => (
          <div
            key={idx}
            className='relative pl-3 border-l-4 border-slate-200 transition-colors group'>
            {/* Remove Button - Edit Mode Only */}
            {isEditing && (
              <button
                onClick={() => removeExperience(idx)}
                className='absolute top-0 right-0 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-100'
                title='Remove Entry'>
                <Trash2 size={12} />
              </button>
            )}

            {isEditing ? (
              <FieldSet>
                <FieldGroup>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <Field>
                      <FieldLabel htmlFor='title'>Role Title</FieldLabel>
                      <Input
                        id='title'
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(idx, 'role', e.target.value)
                        }
                        placeholder='e.g. Senior Product Manager'
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='company'>Company</FieldLabel>
                      <Input
                        id='company'
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(idx, 'company', e.target.value)
                        }
                        placeholder='e.g. Acme Corp'
                      />
                    </Field>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <Field>
                      <FieldLabel htmlFor='start'>Start Date</FieldLabel>
                      <Input
                        id='start'
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(idx, 'startDate', e.target.value)
                        }
                        placeholder='YYYY-MM'
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor='end'>End Date</FieldLabel>
                      <Input
                        id='end'
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(idx, 'endDate', e.target.value)
                        }
                        placeholder='Present'
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor='description'>Description</FieldLabel>
                    <Textarea
                      id='description'
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(idx, 'description', e.target.value)
                      }
                      className='min-h-[70px] mt-0.5 text-xs'
                      placeholder='• Led a team...'
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            ) : (
              <div className='pb-2'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='text-sm font-bold text-slate-900'>
                      {exp.role || 'Untitled Role'}
                    </h4>
                    <p className='text-xs font-medium text-slate-600'>
                      {exp.company || 'Unknown Company'}
                    </p>
                  </div>
                  <span className='text-[10px] text-slate-500 font-mono whitespace-nowrap bg-slate-50 px-2 py-1 rounded'>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className='mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line'>
                  {exp.description}
                </div>
              </div>
            )}
          </div>
        ))}

        {profile.experience.length === 0 && (
          <div className='text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200'>
            <Briefcase className='mx-auto h-5 w-5 text-slate-300 mb-1' />
            <p className='text-slate-500 text-[10px]'>No experience yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
