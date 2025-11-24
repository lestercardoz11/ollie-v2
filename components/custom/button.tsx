import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',
    outline:
      'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-500',
    ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
  };

  const sizes = {
    sm: 'h-7 px-2.5 text-xs',
    md: 'h-8 px-3.5 text-xs', // Compact standard
    lg: 'h-9 px-4 text-sm', // Compact large
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}>
      {isLoading ? (
        <span className='mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent'></span>
      ) : null}
      {children}
    </button>
  );
};
