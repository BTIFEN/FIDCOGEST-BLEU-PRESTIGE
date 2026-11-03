import React from 'react';

export type CardVariant = 'standard' | 'service' | 'information' | 'action';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'standard',
  hoverable = false,
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200 overflow-hidden';

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10 lg:p-12'
  }[padding];

  const variantClasses = {
    standard: 'bg-[#FFFFFF] border border-[#E5E1D8] text-[#1F2937] shadow-xs',
    service:
      'bg-[#FFFFFF] border border-[#E5E1D8] text-[#1F2937] shadow-xs hover:border-[#142B45] hover:shadow-md group',
    information: 'bg-[#F7F6F2] border border-[#E5E1D8] text-[#1F2937] shadow-xs',
    action:
      'bg-[#142B45] border border-[#1D3B5C] text-[#FFFFFF] shadow-sm'
  }[variant];

  const hoverClasses = hoverable && variant !== 'service' ? 'hover:shadow-md hover:border-[#B79661]' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${variantClasses} ${hoverClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};
