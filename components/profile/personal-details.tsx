import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { UserProfile } from '@/lib/types';
import { Field, FieldLabel } from '../ui/field';

export const PersonalDetails = ({
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
          <User size={14} className='text-slate-500' />
          <CardTitle className='text-xs'>Personal Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 p-4'>
        <Field className='gap-0.5'>
          <FieldLabel htmlFor='fullName'>Full Name</FieldLabel>
          {isEditing ? (
            <Input
              id='fullName'
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              placeholder='Jane Doe'
            />
          ) : (
            <div className='text-xs text-slate-700 flex items-center'>
              {profile.fullName || '-'}
            </div>
          )}
        </Field>
        <Field className='gap-0.5'>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          {isEditing ? (
            <Input
              id='email'
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder='jane@example.com'
            />
          ) : (
            <div className='text-xs text-slate-700 flex items-center'>
              {profile.email || '-'}
            </div>
          )}
        </Field>
        <Field className='gap-0.5'>
          <FieldLabel htmlFor='location'>Location</FieldLabel>
          {isEditing ? (
            <Input
              id='location'
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              placeholder='New York, NY'
            />
          ) : (
            <div className='text-xs text-slate-700 flex items-center'>
              {profile.location || '-'}
            </div>
          )}
        </Field>
      </CardContent>
    </Card>
  );
};
