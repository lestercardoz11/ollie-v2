import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MainContainer } from './custom/main-container';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './ui/field';

export default function SettingsView() {
  return (
    <MainContainer>
      <div className='mb-6'>
        <h1 className='text-lg font-bold text-slate-900'>Settings</h1>
        <p className='text-slate-500 text-xs mt-0.5'>
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Password Change Settings */}
      <Card className='border-slate-200 shadow-sm overflow-hidden w-1/2'>
        <CardContent className='space-y-4'>
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Change Password</FieldLegend>
                <FieldDescription>
                  Ensure your password is strong and secure
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor='current-password'>
                      Current Password
                    </FieldLabel>
                    <Input
                      id='current-password'
                      type='password'
                      placeholder='Enter current password'
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='new-password'>New Password</FieldLabel>
                    <Input
                      id='new-password'
                      type='password'
                      placeholder='Enter new password'
                      required
                    />
                    <FieldDescription>
                      Must be at least 8 characters long
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='confirm-password'>
                      Confirm New Password
                    </FieldLabel>
                    <Input
                      id='confirm-password'
                      type='password'
                      placeholder='Confirm new password'
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Field orientation='horizontal'>
                <Button type='submit'>Update Password</Button>
                <Button variant='outline' type='button'>
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
