import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UserProfile } from '@/lib/types';
import { Textarea } from '../ui/textarea';

export const ProfessionalSummary = ({
  profile,
  setProfile,
  isEditing,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}) => {
  return (
    <Card className='py-0 gap-2 overflow-hidden border-slate-200 shadow-sm'>
      <CardHeader className='bg-slate-50 border-b border-slate-100 px-4 py-2.5 [.border-b]:pb-2.5 gap-y-0'>
        <div className='flex items-center gap-2'>
          <FileText size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Professional Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4'>
        {isEditing ? (
          <Textarea
            className='min-h-20 text-xs leading-relaxed'
            placeholder='A brief overview of your career...'
            value={profile.summary}
            onChange={(e) =>
              setProfile({ ...profile, summary: e.target.value })
            }
          />
        ) : (
          <p className='text-xs text-slate-700 leading-relaxed whitespace-pre-wrap'>
            {profile.summary || (
              <span className='text-slate-400 italic'>
                No summary provided.
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
