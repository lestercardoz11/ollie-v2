'use client';

import { Plus, Trash2, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Achievement, UserProfile } from '@/types/db';
import { Button } from '../ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field';
import { Textarea } from '../ui/textarea';

export const Achievements = ({
  profile,
  setProfile,
  isEditing,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}) => {
  // Achievement Handlers
  const addAchievement = () => {
    setProfile((prev) => ({
      ...prev,
      achievements: [
        { id: Date.now().toString(), title: '', date: '', description: '' },
        ...prev.achievements,
      ],
    }));
  };

  const updateAchievement = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const newAch = [...profile.achievements];
    newAch[index] = { ...newAch[index], [field]: value };
    setProfile({ ...profile, achievements: newAch });
  };

  const removeAchievement = (index: number) => {
    setProfile({
      ...profile,
      achievements: profile.achievements.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className='py-0 gap-2 overflow-hidden border-slate-200 shadow-sm'>
      <CardHeader className='bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0 flex flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Trophy size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Key Achievements</CardTitle>
        </div>
        {isEditing && (
          <Button size='icon-sm' variant='ghost' onClick={addAchievement}>
            <Plus className='h-4 w-4' />
          </Button>
        )}
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4 space-y-4'>
        {profile.achievements.length === 0 ? (
          <span className='text-xs text-slate-400 leading-relaxed whitespace-pre-wrap italic'>
            No achievements listed.
          </span>
        ) : (
          profile.achievements.map((ach, idx) => (
            <div
              key={idx}
              className='relative pl-3 border-l-4 border-slate-200 transition-colors group'>
              {isEditing && (
                <button
                  onClick={() => removeAchievement(idx)}
                  className='absolute top-0 right-0 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-100'
                  title='Remove Entry'>
                  <Trash2 size={12} />
                </button>
              )}

              {isEditing ? (
                <FieldSet>
                  <FieldGroup className='grid grid-cols-1 md:grid-cols-10 gap-3'>
                    <Field className='col-span-1 md:col-span-6'>
                      <FieldLabel htmlFor={`ach-title-${idx}`}>
                        Title
                      </FieldLabel>{' '}
                      {/* Added unique ID */}
                      <Input
                        id={`ach-title-${idx}`}
                        value={ach.title}
                        onChange={(e) =>
                          updateAchievement(idx, 'title', e.target.value)
                        }
                        placeholder='Employee of the Year'
                      />
                    </Field>
                    <Field className='col-span-1 md:col-span-4'>
                      <FieldLabel htmlFor={`ach-date-${idx}`}>Date</FieldLabel>{' '}
                      {/* Added unique ID */}
                      <Input
                        id={`ach-date-${idx}`}
                        value={ach.date}
                        onChange={(e) =>
                          updateAchievement(idx, 'date', e.target.value)
                        }
                        placeholder='2024'
                      />
                    </Field>
                  </FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`ach-description-${idx}`}>
                      Description
                    </FieldLabel>{' '}
                    {/* Added unique ID */}
                    <Textarea
                      id={`ach-description-${idx}`}
                      value={ach.description}
                      onChange={(e) =>
                        updateAchievement(idx, 'description', e.target.value)
                      }
                      placeholder='Brief details'
                    />
                  </Field>
                </FieldSet>
              ) : (
                <div>
                  <div className='flex justify-between items-center mb-1'>
                    <h4 className='text-sm font-bold text-slate-900'>
                      {ach.title}
                    </h4>
                    <span className='text-[10px] text-slate-500'>
                      {ach.date}
                    </span>
                  </div>
                  <p className='text-xs text-slate-600'>{ach.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
