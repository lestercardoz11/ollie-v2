import { Copy, Download, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  JobDescription,
  TailoredCV as TailoredCVType,
  UserProfile,
} from '@/types/db';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { ButtonGroup } from '../ui/button-group';
import { downloadResume } from '@/utils/resume';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FieldGroup, FieldSet } from '../ui/field';
import { Separator } from '../ui/separator';
import { convertToBulletPoints } from '@/utils/string';

export const TailoredCV = ({
  userProfile,
  tailorCV,
  job,
  onSave,
}: {
  userProfile: UserProfile;
  tailorCV: TailoredCVType;
  job: JobDescription;
  onSave?: (updatedCV: TailoredCVType) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<TailoredCVType>({
    ...tailorCV,
    experience: tailorCV?.experience || [],
    education: tailorCV?.education || [],
    skills: tailorCV?.skills || [],
    achievements: tailorCV?.achievements || [],
  });
  const [isSaving, setIsSaving] = useState(false);

  // Convert tailorCV to string for display
  const cvContent = formatCVToMarkdown(
    isEditing ? editedContent : tailorCV,
    userProfile
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  const handleDownloadCV = async () => {
    if (!tailorCV || !job) return;
    try {
      await downloadResume(
        userProfile,
        tailorCV,
        `Resume_${job.company.replace(/\s/g, '_')}.pdf`.toLowerCase()
      );
      toast.success('Resume PDF downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  const handleEdit = () => {
    setEditedContent({
      ...tailorCV,
      experience: tailorCV.experience || [],
      education: tailorCV.education || [],
      skills: tailorCV.skills || [],
      achievements: tailorCV.achievements || [],
    });
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
      toast.success('CV updated successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save CV');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent({
      ...tailorCV,
      experience: tailorCV.experience || [],
      education: tailorCV.education || [],
      skills: tailorCV.skills || [],
      achievements: tailorCV.achievements || [],
    });
    setIsEditing(false);
  };

  // Experience handlers
  const addExperience = () => {
    setEditedContent({
      ...editedContent,
      experience: [
        ...(editedContent.experience || []),
        {
          role: '',
          company: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...(editedContent.experience || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditedContent({ ...editedContent, experience: updated });
  };

  const removeExperience = (index: number) => {
    const updated = (editedContent.experience || []).filter(
      (_, i) => i !== index
    );
    setEditedContent({ ...editedContent, experience: updated });
  };

  // Education handlers
  const addEducation = () => {
    setEditedContent({
      ...editedContent,
      education: [
        ...(editedContent.education || []),
        {
          degree: '',
          school: '',
          year: '',
        },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...(editedContent.education || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditedContent({ ...editedContent, education: updated });
  };

  const removeEducation = (index: number) => {
    const updated = (editedContent.education || []).filter(
      (_, i) => i !== index
    );
    setEditedContent({ ...editedContent, education: updated });
  };

  // Skills handlers
  const addSkill = () => {
    setEditedContent({
      ...editedContent,
      skills: [
        ...(editedContent.skills || []),
        {
          id: crypto.randomUUID(),
          name: '',
          category: 'General',
        },
      ],
    });
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const updated = [...(editedContent.skills || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditedContent({ ...editedContent, skills: updated });
  };

  const removeSkill = (index: number) => {
    const updated = (editedContent.skills || []).filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, skills: updated });
  };

  // Achievement handlers
  const addAchievement = () => {
    setEditedContent({
      ...editedContent,
      achievements: [
        ...(editedContent.achievements || []),
        {
          title: '',
          description: '',
          date: '',
        },
      ],
    });
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    const updated = [...(editedContent.achievements || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditedContent({ ...editedContent, achievements: updated });
  };

  const removeAchievement = (index: number) => {
    const updated = (editedContent.achievements || []).filter(
      (_, i) => i !== index
    );
    setEditedContent({ ...editedContent, achievements: updated });
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
                    <h1 className='text-3xl font-bold mb-2 text-slate-900'>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className='text-xl font-semibold mt-6 mb-3 text-slate-800 border-b pb-2'>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className='text-lg font-semibold mt-4 mb-2 text-slate-700'>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className='text-sm leading-relaxed mb-3 text-slate-700'>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className='list-disc pl-6 mb-4 space-y-1'>
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className='text-sm text-slate-700'>{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className='font-semibold text-slate-900'>
                      {children}
                    </strong>
                  ),
                }}>
                {cvContent}
              </ReactMarkdown>
            </div>
          </ScrollArea>

          <ButtonGroup className='absolute top-4 right-4'>
            <Button
              variant='secondary'
              size='sm'
              onClick={handleEdit}
              title='Edit CV'>
              <Edit2 className='h-4 w-4' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => copyToClipboard(cvContent)}
              title='Copy to clipboard'>
              <Copy className='h-4 w-4' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={handleDownloadCV}
              title='Download as PDF'>
              <Download className='h-4 w-4' />
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <div className='mb-4 pr-32'>
            <h3 className='text-lg font-semibold mb-2'>Edit CV</h3>
            <p className='text-sm text-slate-600'>
              Make changes to your CV content below. All changes are saved when
              you click Save.
            </p>
          </div>

          <ScrollArea className='h-[600px] pr-4'>
            <FieldSet className='space-y-6'>
              {/* Summary Section */}
              <FieldGroup>
                <Label htmlFor='summary' className='text-base font-semibold'>
                  Professional Summary
                </Label>
                <Textarea
                  id='summary'
                  value={editedContent.summary || ''}
                  onChange={(e) =>
                    setEditedContent({
                      ...editedContent,
                      summary: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder='Enter your professional summary...'
                  className='resize-none'
                />
              </FieldGroup>

              <Separator />

              {/* Experience Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <Label className='text-base font-semibold'>Experience</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addExperience}>
                    <Plus className='h-4 w-4 mr-1' />
                    Add Experience
                  </Button>
                </div>

                <div className='space-y-6'>
                  {(editedContent.experience || []).map((exp, index) => (
                    <Card key={index} className='p-4 bg-slate-50'>
                      <div className='flex items-start justify-between mb-4'>
                        <h4 className='text-sm font-semibold text-slate-700'>
                          Experience {index + 1}
                        </h4>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeExperience(index)}
                          className='h-8 w-8 p-0'>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>

                      <FieldGroup>
                        <Label htmlFor={`exp-role-${index}`}>Role</Label>
                        <Input
                          id={`exp-role-${index}`}
                          value={exp.role}
                          onChange={(e) =>
                            updateExperience(index, 'role', e.target.value)
                          }
                          placeholder='e.g., Senior Software Engineer'
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label htmlFor={`exp-company-${index}`}>Company</Label>
                        <Input
                          id={`exp-company-${index}`}
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(index, 'company', e.target.value)
                          }
                          placeholder='e.g., Tech Corp'
                        />
                      </FieldGroup>

                      <div className='grid grid-cols-2 gap-4'>
                        <FieldGroup>
                          <Label htmlFor={`exp-start-${index}`}>
                            Start Date
                          </Label>
                          <Input
                            id={`exp-start-${index}`}
                            value={exp.startDate}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                'startDate',
                                e.target.value
                              )
                            }
                            placeholder='e.g., Jan 2020'
                          />
                        </FieldGroup>

                        <FieldGroup>
                          <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                          <Input
                            id={`exp-end-${index}`}
                            value={exp.endDate || ''}
                            onChange={(e) =>
                              updateExperience(index, 'endDate', e.target.value)
                            }
                            placeholder='e.g., Present'
                          />
                        </FieldGroup>
                      </div>

                      <FieldGroup>
                        <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`exp-desc-${index}`}
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder='Describe your role and achievements...'
                          className='resize-none'
                        />
                      </FieldGroup>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Education Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <Label className='text-base font-semibold'>Education</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addEducation}>
                    <Plus className='h-4 w-4 mr-1' />
                    Add Education
                  </Button>
                </div>

                <div className='space-y-4'>
                  {(editedContent.education || []).map((edu, index) => (
                    <Card key={index} className='p-4 bg-slate-50'>
                      <div className='flex items-start justify-between mb-4'>
                        <h4 className='text-sm font-semibold text-slate-700'>
                          Education {index + 1}
                        </h4>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeEducation(index)}
                          className='h-8 w-8 p-0'>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>

                      <FieldGroup>
                        <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                        <Input
                          id={`edu-degree-${index}`}
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, 'degree', e.target.value)
                          }
                          placeholder='e.g., Bachelor of Science in Computer Science'
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label htmlFor={`edu-school-${index}`}>School</Label>
                        <Input
                          id={`edu-school-${index}`}
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(index, 'school', e.target.value)
                          }
                          placeholder='e.g., University of Technology'
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label htmlFor={`edu-year-${index}`}>Year</Label>
                        <Input
                          id={`edu-year-${index}`}
                          value={edu.year}
                          onChange={(e) =>
                            updateEducation(index, 'year', e.target.value)
                          }
                          placeholder='e.g., 2020'
                        />
                      </FieldGroup>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Skills Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <Label className='text-base font-semibold'>Skills</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addSkill}>
                    <Plus className='h-4 w-4 mr-1' />
                    Add Skill
                  </Button>
                </div>

                <div className='space-y-3'>
                  {(editedContent.skills || []).map((skill, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                      <div className='flex-1 grid grid-cols-2 gap-3'>
                        <Input
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(index, 'name', e.target.value)
                          }
                          placeholder='Skill name'
                        />
                        <Input
                          value={skill.category || ''}
                          onChange={(e) =>
                            updateSkill(index, 'category', e.target.value)
                          }
                          placeholder='Category (e.g., Technical)'
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeSkill(index)}
                        className='h-8 w-8 p-0'>
                        <Trash2 className='h-4 w-4 text-red-500' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Achievements Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <Label className='text-base font-semibold'>
                    Achievements
                  </Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addAchievement}>
                    <Plus className='h-4 w-4 mr-1' />
                    Add Achievement
                  </Button>
                </div>

                <div className='space-y-4'>
                  {(editedContent.achievements || []).map((ach, index) => (
                    <Card key={index} className='p-4 bg-slate-50'>
                      <div className='flex items-start justify-between mb-4'>
                        <h4 className='text-sm font-semibold text-slate-700'>
                          Achievement {index + 1}
                        </h4>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeAchievement(index)}
                          className='h-8 w-8 p-0'>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>

                      <FieldGroup>
                        <Label htmlFor={`ach-title-${index}`}>Title</Label>
                        <Input
                          id={`ach-title-${index}`}
                          value={ach.title}
                          onChange={(e) =>
                            updateAchievement(index, 'title', e.target.value)
                          }
                          placeholder='e.g., Employee of the Year'
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label htmlFor={`ach-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`ach-desc-${index}`}
                          value={ach.description}
                          onChange={(e) =>
                            updateAchievement(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          rows={2}
                          placeholder='Describe the achievement...'
                          className='resize-none'
                        />
                      </FieldGroup>

                      <FieldGroup>
                        <Label htmlFor={`ach-date-${index}`}>Date</Label>
                        <Input
                          id={`ach-date-${index}`}
                          value={ach.date || ''}
                          onChange={(e) =>
                            updateAchievement(index, 'date', e.target.value)
                          }
                          placeholder='e.g., 2023'
                        />
                      </FieldGroup>
                    </Card>
                  ))}
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

// Helper function to format CV object to markdown
function formatCVToMarkdown(cv: TailoredCVType, profile: UserProfile): string {
  let markdown = `# ${profile.full_name}\n\n`;

  if (profile.email || profile.phone || profile.location) {
    markdown += `**Contact Information**\n\n`;
    if (profile.email) markdown += `- Email: ${profile.email}\n`;
    if (profile.phone) markdown += `- Phone: ${profile.phone}\n`;
    if (profile.location) markdown += `- Location: ${profile.location}\n`;
    if (profile.linkedin) markdown += `- LinkedIn: ${profile.linkedin}\n`;
    if (profile.portfolio) markdown += `- Portfolio: ${profile.portfolio}\n`;
    markdown += '\n';
  }

  if (cv.summary) {
    markdown += `## Professional Summary\n\n${cv.summary}\n\n`;
  }

  if (cv.experience && cv.experience.length > 0) {
    markdown += `## Experience\n\n`;
    cv.experience.forEach((exp) => {
      markdown += `### ${exp.role} at ${exp.company}\n`;
      markdown += `*${exp.startDate} - ${exp.endDate || 'Present'}*\n\n`;
      markdown += `${convertToBulletPoints(exp.description)}\n\n`;
    });
  }

  if (cv.education && cv.education.length > 0) {
    markdown += `## Education\n\n`;
    cv.education.forEach((edu) => {
      markdown += `### ${edu.degree}\n`;
      markdown += `**${edu.school}**\n`;
      markdown += `*${edu.year}*\n`;
      markdown += '\n';
    });
  }

  if (cv.skills && cv.skills.length > 0) {
    markdown += `## Skills\n\n`;
    const skillsByCategory = cv.skills.reduce((acc, skill) => {
      const cat = skill.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      markdown += `**${category}**: ${skills.join(', ')}\n\n`;
    });
  }

  if (cv.achievements && cv.achievements.length > 0) {
    markdown += `## Achievements\n\n`;
    cv.achievements.forEach((ach) => {
      markdown += `- **${ach.title}**: ${ach.description}`;
      if (ach.date) markdown += ` (${ach.date})`;
      markdown += '\n';
    });
  }

  return markdown;
}
