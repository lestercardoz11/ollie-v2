'use client';

import {
  ChevronsUpDown,
  Code,
  Cpu,
  Lightbulb,
  LucideIcon,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skill, UserProfile } from '@/types/db';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Field, FieldGroup, FieldSet } from '../ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { db } from '@/services/browser-client/db';

export const Skills = ({
  profile,
  setProfile,
  isEditing,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedSkills = await db.getSkills();
      setAllSkills(
        fetchedSkills.filter(
          (s) => !profile.skills.some((userSkill) => userSkill.id === s.id)
        )
      );
    }
    fetchData();
  }, [isEditing, profile.skills]);

  const ICON_MAP: LucideIcon[] = [
    Cpu,
    Users,
    TrendingUp,
    MessageSquare,
    Target,
    Code,
  ];

  const COLOR_MAP: string[] = [
    'text-blue-500',
    'text-emerald-500',
    'text-purple-500',
    'text-pink-500',
    'text-teal-500',
    'text-orange-500',
  ];

  const IconRenderer = ({ iconKey }: { iconKey: number }) => {
    const inputKey = Math.floor(iconKey);
    const totalIcons = ICON_MAP.length;

    const index = inputKey % totalIcons;

    if (inputKey < 0) {
      return <XCircle size={12} className='text-red-500' />;
    }

    // Get the Icon component from the map
    const IconComponent = ICON_MAP[index];

    // Render the selected Icon component
    return <IconComponent size={12} className={COLOR_MAP[index]} />;
  };

  // Skills Handlers
  const handleAddSkill = (value: string) => {
    const exists = profile.skills.some((s) => s.id.toLowerCase() === value);

    if (exists) {
      toast.info(`Skill already exists!`);
      return;
    }

    const found = allSkills.find((s) => s.id === value);
    if (!found) return;

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, found],
    }));
  };

  const handleRemoveSkill = (value: string) => {
    if (!isEditing) return;

    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== value),
    }));
  };

  return (
    <Card className='py-0 gap-2 overflow-hidden border-slate-200 shadow-sm'>
      <CardHeader className='bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0'>
        <div className='flex items-center gap-2'>
          <Lightbulb size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Skills & Keywords</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4 space-y-5'>
        {isEditing && (
          <div className='bg-slate-50/50 p-2 rounded-lg border border-slate-100 space-y-2'>
            <FieldSet>
              <FieldGroup>
                <Field orientation={'horizontal'}>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between'>
                        {'Select skill'}
                        <ChevronsUpDown className='opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Search skills'
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>No skill found.</CommandEmpty>
                          <CommandGroup>
                            {allSkills.map((skill) => (
                              <CommandItem
                                key={skill.id}
                                value={skill.id}
                                onSelect={(currentValue) => {
                                  handleAddSkill(currentValue);
                                  setOpen(false);
                                }}>
                                {skill.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>
              </FieldGroup>
            </FieldSet>
            <p className='text-[9px] text-slate-400 px-1'>
              Select a category to organize your skills for better matching.
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {profile.skills.length === 0 ? (
          <div className='justify-center text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200'>
            <Lightbulb
              size={14}
              className='mx-auto h-5 w-5 text-slate-300 mb-1'
            />
            <p className='text-slate-500 text-[10px]'>No skills added yet.</p>
          </div>
        ) : (
          [...new Set(profile.skills.map((s) => s.category))].map(
            (category, idx) => (
              <div key={idx}>
                <div className='flex items-center gap-1.5 mb-2'>
                  {IconRenderer({ iconKey: idx })}
                  <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wide'>
                    {category} {category.includes('skill') ? '' : 'Skills'}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1.5 content-start'>
                  {profile.skills
                    .filter((s) => s.category === category)
                    .map((skill, keydx) => (
                      <div
                        key={keydx}
                        className={`inline-flex items-center bg-white border border-blue-100 ${
                          COLOR_MAP[idx]
                        } rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm ${
                          isEditing ? 'pr-1' : ''
                        }`}>
                        <span>{skill.name}</span>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className='ml-1 text-red-300 hover:text-red-600'>
                            <XCircle size={10} />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )
          )
        )}
      </CardContent>
    </Card>
  );
};
