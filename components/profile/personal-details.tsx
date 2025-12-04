import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { UserProfile } from '@/types/db';
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
      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
        <DetailField
          field='full_name'
          label='Full Name'
          placeholder='Jane Doe'
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
        />
        <DetailField
          field='email'
          label='Email'
          placeholder='jane@example.com'
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
        />
        <DetailField
          field='phone'
          label='Phone'
          placeholder='+1 XXX-XXX-XXXX'
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
        />
        <DetailField
          field='linkedin'
          label='Linkedin'
          placeholder='https://www.linkedin.com/in/janedoe'
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
        />
        <DetailField
          field='location'
          label='Location'
          placeholder='New York, NY'
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
        />
        <DetailField
          field='portfolio'
          label='Portfolio'
          placeholder='www.janedoe.com'
          isEditing={isEditing}
          profile={profile}
          setProfile={setProfile}
        />
      </CardContent>
    </Card>
  );
};

const DetailField = ({
  field,
  label,
  placeholder,
  isEditing,
  profile,
  setProfile,
}: {
  field: keyof UserProfile;
  label: string;
  placeholder: string;
  isEditing: boolean;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}) => {
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const value = profile[field] || '';

  const inputValue = (typeof value === 'string' ? value : '').toString();

  return (
    <Field className='gap-0.5'>
      <FieldLabel htmlFor={field as string} className='text-xs'>
        {label}
      </FieldLabel>
      {isEditing ? (
        <Input
          id={field as string}
          value={inputValue}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          disabled={field === 'email'}
        />
      ) : (
        <div className='text-sm text-slate-700'>{inputValue || '-'}</div>
      )}
    </Field>
  );
};
