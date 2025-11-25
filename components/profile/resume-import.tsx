import { FileText, Upload } from 'lucide-react';
import { CardHeader, CardTitle } from '../ui/card';
import { Spinner } from '../ui/spinner';
import React, { useState } from 'react';
import {
  fileToBase64,
  handleDragLeave,
  handleDragOver,
} from '../../utils/document';
import { parseResumeWithGemini } from '@/services/geminiService';
import { UserProfile, SkillCategories } from '@/lib/types';
import { toast } from 'sonner';
import { db } from '@/services/db';

export const ResumeImport = ({
  profile,
  setProfile,
  setLastSavedProfile,
}: {
  profile: UserProfile;
  setProfile: (v: UserProfile) => void;
  setLastSavedProfile: (v: UserProfile) => void;
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [isResumeDragOver, setIsResumeDragOver] = useState(false);

  // ------------------- Resume Parsing Handlers -------------------

  const handleResumeUpload = async (file: File) => {
    if (!file) return;

    setIsParsing(true);
    try {
      const base64String = await fileToBase64(file);
      const parsedData = await parseResumeWithGemini(base64String, file.type);

      // Merge parsed skills (which are categorized) with existing
      const mergedSkills: SkillCategories = {
        technical: Array.from(
          new Set([
            ...profile.skills.technical,
            ...(parsedData?.skills?.technical || []),
          ])
        ),
        soft: Array.from(
          new Set([...profile.skills.soft, ...(parsedData?.skills?.soft || [])])
        ),
        keywords: Array.from(
          new Set([
            ...profile.skills.keywords,
            ...(parsedData?.skills?.keywords || []),
          ])
        ),
      };

      const newProfile: UserProfile = {
        ...profile,
        fullName: parsedData?.fullName || profile.fullName,
        summary: parsedData?.summary || profile.summary,
        skills: mergedSkills,
        experience: parsedData?.experience || profile.experience,
        education: parsedData?.education || profile.education,
        achievements: parsedData?.achievements || profile.achievements,
      };

      setProfile(newProfile);
      await db.saveProfile(newProfile);
      setLastSavedProfile(newProfile);
      toast.success('Resume parsed and profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse resume with AI.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeDragOver(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === 'application/pdf' || file.type === 'text/plain')
    ) {
      handleResumeUpload(file);
    } else {
      toast.error('Please upload a PDF or Text file.');
    }
  };

  return (
    <label
      className={`block bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-sm cursor-pointer group
              ${
                isResumeDragOver
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-blue-300'
              }
            `}
      onDragOver={(e) => handleDragOver(e, setIsResumeDragOver)}
      onDragLeave={(e) => handleDragLeave(e, setIsResumeDragOver)}
      onDrop={handleResumeDrop}>
      <input
        type='file'
        accept='.pdf,.txt'
        className='hidden'
        onChange={(e) =>
          e.target.files?.[0] && handleResumeUpload(e.target.files[0])
        }
        disabled={isParsing}
      />
      <CardHeader className='bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0'>
        <div className='flex items-center gap-2'>
          <FileText size={14} className='text-blue-600' />
          <CardTitle className='text-xs'>Resume</CardTitle>
        </div>
      </CardHeader>

      <div className='p-4 text-center'>
        {isParsing ? (
          <div className='flex flex-col items-center justify-center gap-2 py-1'>
            <Spinner />
            <span className='text-[10px] font-medium text-slate-700'>
              Analyzing Resume...
            </span>
          </div>
        ) : (
          <div className='space-y-1.5'>
            <div className='flex justify-center'>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  isResumeDragOver
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                <Upload size={16} />
              </div>
            </div>
            <div>
              <p className='text-[11px] font-medium text-slate-900'>
                Upload PDF
              </p>
              <p className='text-[9px] text-slate-500'>Auto-fills profile</p>
            </div>
          </div>
        )}
      </div>
    </label>
  );
};
