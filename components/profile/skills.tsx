'use client';

import {
  Cpu,
  Lightbulb,
  MessageCircle,
  Plus,
  Tag,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Skill, UserProfile } from '@/types/db';
import { Button } from '../ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Field, FieldGroup, FieldSet } from '../ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Redefine SkillCategories to group the flat array for rendering
type CategorizedSkills = {
  technical: string[];
  soft: string[];
  keywords: string[];
};

export const Skills = ({
  profile,
  setProfile,
  isEditing,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}) => {
  // Skills Input State
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<
    'technical' | 'soft' | 'keywords'
  >('technical');

  const categorizedSkills: CategorizedSkills = {
    technical: profile.skills,
    soft: [],
    keywords: [],
  };

  // Skills Handlers
  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    const skillName = skillInput.trim();
    if (!skillName) return;

    const category = selectedSkillCategory;

    const exists = profile.skills.some(
      (s) => s.toLowerCase() === skillName.toLowerCase()
    );
    if (exists) {
      setSkillInput('');
      toast.info(`Skill "${skillName}" already exists!`);
      return;
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName,
      category: category,
    };

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.name],
    }));
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    if (!isEditing) return;

    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillId),
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
                  <Select
                    value={selectedSkillCategory}
                    onValueChange={(value: 'technical' | 'soft' | 'keywords') =>
                      setSelectedSkillCategory(value)
                    }>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='technical'>Technical</SelectItem>
                      <SelectItem value='soft'>Soft Skills</SelectItem>
                      <SelectItem value='keywords'>Keywords</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id='skill'
                    placeholder='Add Skills'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    required
                  />
                  <Button
                    onClick={() => handleAddSkill()}
                    size='icon'
                    variant={'ghost'}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
            <p className='text-[9px] text-slate-400 px-1'>
              Select a category to organize your skills for better matching.
            </p>
          </div>
        )}

        {/* Technical Skills */}
        <div>
          <div className='flex items-center gap-1.5 mb-2'>
            <Cpu size={12} className='text-blue-500' />
            <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wide'>
              Technical / Hard Skills
            </span>
          </div>
          <div className='flex flex-wrap gap-1.5 content-start'>
            {categorizedSkills.technical.length === 0 ? (
              <span className='text-[10px] text-slate-400 italic'>
                No technical skills.
              </span>
            ) : (
              categorizedSkills.technical.map((skill, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center bg-white border border-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm ${
                    isEditing ? 'pr-1' : ''
                  }`}>
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className='ml-1 text-blue-300 hover:text-red-500'>
                      <XCircle size={10} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <div className='flex items-center gap-1.5 mb-2'>
            <MessageCircle size={12} className='text-emerald-500' />
            <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wide'>
              Soft Skills
            </span>
          </div>
          <div className='flex flex-wrap gap-1.5 content-start'>
            {/* 🐛 FIX 5: Use categorizedSkills for rendering */}
            {categorizedSkills.soft.length === 0 ? (
              <span className='text-[10px] text-slate-400 italic'>
                No soft skills.
              </span>
            ) : (
              categorizedSkills.soft.map((skill, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center bg-white border border-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm ${
                    isEditing ? 'pr-1' : ''
                  }`}>
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className='ml-1 text-emerald-300 hover:text-red-500'>
                      <XCircle size={10} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <div className='flex items-center gap-1.5 mb-2'>
            <Tag size={12} className='text-purple-500' />
            <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wide'>
              Keywords / Industry
            </span>
          </div>
          <div className='flex flex-wrap gap-1.5 content-start'>
            {/* 🐛 FIX 5: Use categorizedSkills for rendering */}
            {categorizedSkills.keywords.length === 0 ? (
              <span className='text-[10px] text-slate-400 italic'>
                No keywords.
              </span>
            ) : (
              categorizedSkills.keywords.map((skill, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center bg-white border border-purple-100 text-purple-700 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm ${
                    isEditing ? 'pr-1' : ''
                  }`}>
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className='ml-1 text-purple-300 hover:text-red-500'>
                      <XCircle size={10} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
