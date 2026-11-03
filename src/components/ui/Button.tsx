import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'discrete' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidthOnMobile?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  to?: string;
  external?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidthOnMobile = true,
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  to,
  external,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Base classes with WCAG AA compliance, focus rings, touch targets >= 44px
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79661] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shrink-0 text-center select-none';

  // Size variants ensuring touch target >= 44px
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-xs gap-1.5',
    md: 'min-h-[48px] px-5 py-3 text-sm gap-2',
    lg: 'min-h-[52px] px-6 py-3.5 text-base gap-2.5'
  }[size];

  // Width classes
  const widthClasses = fullWidth
    ? 'w-full'
    : fullWidthOnMobile
    ? 'w-full sm:w-auto'
    : '';

  // Variant color definitions with strict contrast
  const variantClasses = {
    primary:
      'bg-[#142B45] hover:bg-[#1D3B5C] active:bg-[#0E2035] text-[#FFFFFF] border border-[#142B45] shadow-sm',
    secondary:
      'bg-[#FFFFFF] hover:bg-[#FAF9F6] active:bg-[#F0EEE9] text-[#142B45] border border-[#D9DDE2] hover:border-[#142B45] shadow-xs',
    gold:
      'bg-[#F3D085] hover:bg-[#E8C06C] active:bg-[#DCAE53] text-[#0D1E30] border border-[#E2BD6D] shadow-sm font-extrabold',
    discrete:
      'bg-transparent hover:bg-[#FAF9F6] active:bg-[#F0EEE9] text-[#142B45] border border-transparent hover:border-[#D9DDE2]',
    danger:
      'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-[#FFFFFF] border border-[#DC2626] shadow-sm'
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${widthClasses} ${variantClasses} ${className}`.trim();

  const isSecondary = variant === 'secondary' || className.includes('bg-white') || className.includes('bg-[#FFFFFF]');

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0 flex items-center" style={isSecondary ? { color: '#102B47' } : undefined}>{icon}</span>
      ) : null}
      <span className="whitespace-nowrap tracking-wide" style={isSecondary ? { color: '#102B47' } : undefined}>
        {children}
      </span>
      {!isLoading && icon && iconPosition === 'right' ? (
        <span className="shrink-0 flex items-center" style={isSecondary ? { color: '#102B47' } : undefined}>{icon}</span>
      ) : null}
    </>
  );

  if (to) {
    if (external) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};
