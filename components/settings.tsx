import { Bell, User, Shield, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MainContainer } from './custom/main-container';

export default function SettingsView() {
  return (
    <MainContainer>
      <div className='mb-6'>
        <h1 className='text-lg font-bold text-slate-900'>Settings</h1>
        <p className='text-slate-500 text-xs mt-0.5'>
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Account Settings */}
      <Card className='border-slate-200 shadow-sm overflow-hidden'>
        <CardHeader className='bg-slate-50 border-b border-slate-100 px-6 py-4'>
          <div className='flex items-center gap-2'>
            <User size={16} className='text-slate-500' />
            <CardTitle className='text-sm'>Account Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='p-6 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label>Display Name</Label>
              <Input defaultValue='User' disabled className='bg-slate-50' />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                defaultValue='user@example.com'
                disabled
                className='bg-slate-50'
              />
            </div>
          </div>
          <div className='flex justify-end pt-2'>
            <Button variant='outline' size='sm'>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className='border-slate-200 shadow-sm overflow-hidden'>
        <CardHeader className='bg-slate-50 border-b border-slate-100 px-6 py-4'>
          <div className='flex items-center gap-2'>
            <Bell size={16} className='text-slate-500' />
            <CardTitle className='text-sm'>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='p-6 space-y-4'>
          <div className='flex items-center justify-between border-b border-slate-50 pb-4'>
            <div>
              <p className='text-xs font-medium text-slate-900'>Email Digest</p>
              <p className='text-[10px] text-slate-500'>
                Receive a weekly summary of your applications and new features.
              </p>
            </div>
            <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
              <input
                type='checkbox'
                name='toggle'
                id='toggle1'
                className='toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-600'
                defaultChecked
              />
              <label
                htmlFor='toggle1'
                className='toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer checked:bg-blue-600'></label>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-slate-900'>
                Application Updates
              </p>
              <p className='text-[10px] text-slate-500'>
                Get notified when a job generation is complete.
              </p>
            </div>
            <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
              <input
                type='checkbox'
                name='toggle'
                id='toggle2'
                className='toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-600'
                defaultChecked
              />
              <label
                htmlFor='toggle2'
                className='toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer checked:bg-blue-600'></label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Placeholder */}
      <Card className='border-slate-200 shadow-sm overflow-hidden'>
        <CardHeader className='bg-slate-50 border-b border-slate-100 px-6 py-4'>
          <div className='flex items-center gap-2'>
            <CreditCard size={16} className='text-slate-500' />
            <CardTitle className='text-sm'>Subscription</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between'>
            <div>
              <p className='text-xs font-bold text-blue-900'>Free Plan</p>
              <p className='text-[10px] text-blue-700'>
                You are currently on the free tier.
              </p>
            </div>
            <Button size='sm'>Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className='border-slate-200 shadow-sm overflow-hidden opacity-60'>
        <CardHeader className='bg-slate-50 border-b border-slate-100 px-6 py-4'>
          <div className='flex items-center gap-2'>
            <Shield size={16} className='text-slate-500' />
            <CardTitle className='text-sm'>Security & Privacy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <p className='text-xs text-slate-500'>
            Security settings are managed via your authentication provider.
          </p>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
