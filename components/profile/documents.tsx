import {
  Check,
  CloudUpload,
  FolderOpen,
  Loader2,
  Paperclip,
  Repeat,
  Sparkles,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SupportingDocument, UserProfile } from '@/types/db';
import { handleDragLeave, handleDragOver } from '../../utils/document';
import { toast } from 'sonner';
import { useState } from 'react';
import { db } from '@/services/browser-client/db';
import { reparseAllDocuments, uploadFileAndParse } from '@/utils/parser';
import { Button } from '../ui/button';
import { getDocumentLink } from '@/utils/file';

const MAX_DOCS = 5;

interface ActiveUpload {
  id: string;
  fileName: string;
  progress: number;
  status: string;
}

export const Documents = ({
  profile,
  setProfile,
  setLastSavedProfile,
  supportingDocuments,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setLastSavedProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  supportingDocuments: SupportingDocument[];
}) => {
  // Drag states
  const [isDocDragOver, setIsDocDragOver] = useState(false);

  const [documents, setDocuments] =
    useState<SupportingDocument[]>(supportingDocuments);

  // Upload Progress State - Multiple files
  const [activeUploads, setActiveUploads] = useState<ActiveUpload[]>([]);

  const handleFiles = (files: FileList) => {
    const remaining = MAX_DOCS - (documents.length + activeUploads.length);
    if (remaining <= 0) {
      toast.error(`Maximum of ${MAX_DOCS} documents allowed.`);
      return;
    }

    const filesToUpload = Array.from(files);
    if (filesToUpload.length > remaining) {
      toast.info(
        `You can only upload ${remaining} more document${
          remaining === 1 ? '' : 's'
        }.`
      );
      filesToUpload
        .slice(0, remaining)
        .forEach((file) =>
          uploadFileAndParse(
            file,
            documents,
            setDocuments,
            profile,
            setProfile,
            setLastSavedProfile,
            setActiveUploads
          )
        );
    } else {
      filesToUpload.forEach((file) =>
        uploadFileAndParse(
          file,
          documents,
          setDocuments,
          profile,
          setProfile,
          setLastSavedProfile,
          setActiveUploads
        )
      );
    }
  };

  const handleDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDocDragOver(false);

    if (documents.length >= MAX_DOCS) {
      toast.error(`Maximum of ${MAX_DOCS} documents allowed.`);
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document?')) return;
    try {
      await db.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete document.');
    }
  };

  return (
    <Card className='py-0 gap-2 overflow-hidden border-slate-200 shadow-sm'>
      <CardHeader className='flex justify-between items-center bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0'>
        <div className='flex items-center gap-2'>
          <FolderOpen size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>
            Documents ({documents.length}/{MAX_DOCS})
          </CardTitle>
        </div>
        <Button
          size={'icon-sm'}
          variant={'ghost'}
          className='rounded-full'
          onClick={() =>
            reparseAllDocuments(
              documents,
              profile,
              setProfile,
              setLastSavedProfile,
              '',
              setActiveUploads
            )
          }>
          <Repeat />
        </Button>
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4'>
        <label
          className={`block w-full rounded-lg border-2 border-dashed p-3 text-center cursor-pointer transition-all duration-200 mb-2.5
                  ${
                    documents.length >= MAX_DOCS
                      ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                      : isDocDragOver
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-50'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }
                `}
          onDragOver={(e) => {
            if (documents.length < MAX_DOCS)
              handleDragOver(e, setIsDocDragOver);
          }}
          onDragLeave={(e) => handleDragLeave(e, setIsDocDragOver)}
          onDrop={handleDocDrop}>
          <input
            type='file'
            className='hidden'
            multiple
            disabled={documents.length >= MAX_DOCS}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <div className='flex flex-col items-center justify-center gap-1'>
            <div
              className={`p-1 rounded-full transition-colors ${
                isDocDragOver
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-400'
              }`}>
              <CloudUpload size={14} />
            </div>
            <div className='text-[10px] text-slate-600 font-medium'>
              {documents.length >= MAX_DOCS ? (
                <span className='text-red-500'>Limit Reached</span>
              ) : (
                <div className='w-1/2 mx-auto'>
                  <span className='text-blue-600 hover:underline'>Upload</span>{' '}
                  documents to auto-fill your profile, or drag & drop here.
                </div>
              )}
            </div>
          </div>
        </label>

        {/* Active Uploads Progress */}
        <div className='space-y-2 mb-3'>
          {activeUploads.map((upload) => {
            const isAnalyzing = upload.status.includes('Analyz');
            const isComplete = upload.progress === 100;

            return (
              <div
                key={upload.id}
                className='relative overflow-hidden p-1.5 bg-slate-50 rounded border border-slate-100 group'>
                <div className='flex justify-between items-center text-[10px] mb-1.5 font-medium'>
                  <div className='flex items-center gap-1.5 truncate max-w-[70%]'>
                    {isAnalyzing ? (
                      <Sparkles
                        size={10}
                        className='text-blue-500 animate-pulse'
                      />
                    ) : isComplete ? (
                      <Check size={10} className='text-emerald-500' />
                    ) : (
                      <Loader2
                        size={10}
                        className='text-blue-500 animate-spin'
                      />
                    )}
                    <span className='text-slate-700 truncate'>
                      {upload.fileName}
                    </span>
                  </div>
                  <span className='text-slate-500'>
                    {Math.round(upload.progress)}%
                  </span>
                </div>

                <div className='h-1 w-full bg-slate-100 rounded-full overflow-hidden'>
                  <div
                    className={`h-full transition-all duration-500 ease-out rounded-full ${
                      isAnalyzing
                        ? 'bg-blue-500'
                        : isComplete
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${upload.progress}%` }}></div>
                </div>

                <p
                  className={`text-[9px] mt-1.5 font-medium ${
                    isAnalyzing
                      ? 'text-blue-500'
                      : isComplete
                      ? 'text-emerald-600'
                      : 'text-slate-500'
                  }`}>
                  {upload.status}
                </p>
              </div>
            );
          })}
        </div>

        {/* Document List */}
        <div className='space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar'>
          {documents.map((upload) => (
            <div
              key={upload.id}
              className='flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100 group hover:border-blue-200 transition-all'>
              <div className='flex items-center gap-2 overflow-hidden'>
                <div className='h-5 w-5 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0'>
                  <Paperclip size={10} className='text-slate-400' />
                </div>
                <a
                  href={getDocumentLink(upload.file_url)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[10px] text-slate-700 truncate hover:text-blue-600 font-medium hover:underline'>
                  {upload.name}
                </a>
              </div>
              <button
                onClick={() => handleDeleteDoc(upload.id)}
                className='text-slate-400 hover:text-red-500 p-0.5 rounded hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100'
                title='Delete Document'>
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
