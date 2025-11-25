import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Education as EducationType, UserProfile } from '@/lib/types';
import { Button } from '../ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field';

export const Education = ({
  profile,
  setProfile,
  isEditing,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}) => {
  // Education Handlers
  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        { id: Date.now().toString(), school: '', degree: '', year: '' },
        ...prev.education,
      ],
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof EducationType,
    value: string
  ) => {
    const newEdu = [...profile.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setProfile({ ...profile, education: newEdu });
  };

  const removeEducation = (index: number) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className='py-0 gap-2 overflow-hidden border-slate-200 shadow-sm'>
      <CardHeader className='bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0 flex flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          <GraduationCap size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Education</CardTitle>
        </div>
        {isEditing && (
          <Button size='icon-sm' variant='ghost' onClick={addEducation}>
            <Plus />
          </Button>
        )}
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4 space-y-4'>
        {profile.education.map((edu, idx) => (
          <div
            key={edu.id || idx}
            className='relative pl-3 border-l-4 border-slate-200 transition-colors group'>
            {isEditing && (
              <button
                onClick={() => removeEducation(idx)}
                className='absolute top-0 right-0 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-100'
                title='Remove Entry'>
                <Trash2 size={12} />
              </button>
            )}

            {isEditing ? (
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor='school'>
                      School / University
                    </FieldLabel>
                    <Input
                      id='school'
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(idx, 'school', e.target.value)
                      }
                      placeholder='University of...'
                    />
                    <FieldLabel htmlFor='degree'>Degree</FieldLabel>
                    <Input
                      id='degree'
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(idx, 'degree', e.target.value)
                      }
                      placeholder='BSc Computer Science'
                    />
                    <FieldLabel htmlFor='year'>Year</FieldLabel>
                    <Input
                      id='year'
                      value={edu.year}
                      onChange={(e) =>
                        updateEducation(idx, 'year', e.target.value)
                      }
                      placeholder='2023'
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            ) : (
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <h4 className='text-sm font-bold text-slate-900'>
                    {edu.school || ''}
                  </h4>
                  <p className='text-xs text-slate-600'>{edu.degree}</p>
                </div>
                <span className='text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded'>
                  {edu.year}
                </span>
              </div>
            )}
          </div>
        ))}
        {profile.education.length === 0 && (
          <div className='text-center py-4'>
            <p className='text-slate-400 text-[10px]'>No education listed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
