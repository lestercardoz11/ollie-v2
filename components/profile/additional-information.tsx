import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UserProfile } from '@/lib/types';
import { Textarea } from '../ui/textarea';

export const AdditionalInformation = ({
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
          <Info size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Additional Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pt-4 pb-4'>
        {isEditing ? (
          <div className='space-y-2'>
            <Textarea
              className='min-h-20 text-xs leading-relaxed'
              placeholder='Add any other relevant info, career goals, or preferences...'
              value={profile.additionalInfo}
              onChange={(e) =>
                setProfile({ ...profile, additionalInfo: e.target.value })
              }
            />
            <p className='text-[9px] text-slate-400'>
              This info is used by the AI Chatbot to better answer your
              questions.
            </p>
          </div>
        ) : (
          <p className='text-xs text-slate-700 leading-relaxed whitespace-pre-wrap'>
            {profile.additionalInfo || (
              <span className='text-slate-400 italic'>
                No additional information provided.
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
