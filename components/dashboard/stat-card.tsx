import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = React.memo<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}>(({ icon, label, value, bgColor, textColor }) => (
  <Card className='border-slate-200/60'>
    <CardContent className='flex items-center gap-3'>
      <div
        className={`h-9 w-9 rounded-lg ${bgColor} ${textColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wide'>
          {label}
        </p>
        <h3 className='text-xl font-bold text-slate-900'>{value}</h3>
      </div>
    </CardContent>
  </Card>
));
StatCard.displayName = 'StatCard';
export default StatCard;
