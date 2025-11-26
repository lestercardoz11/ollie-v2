import { cn } from '@/lib/utils';
import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={cn('w-full h-full space-y-4', className)}>{children}</div>
  );
};
