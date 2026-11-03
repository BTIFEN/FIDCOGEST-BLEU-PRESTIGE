import React from 'react';

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-bold text-[#142B45]"
      >
        {label}
        {required && <span className="text-[#DC2626] ml-1">*</span>}
      </label>

      {children}

      {error ? (
        <p className="text-xs font-semibold text-[#DC2626] flex items-center gap-1 mt-1">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#6B7280] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFFFF] border text-xs sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] transition-all focus:outline-none focus:ring-2 focus:ring-[#B79661] ${
          error
            ? 'border-[#DC2626] focus:ring-[#DC2626]'
            : 'border-[#D9DDE2] focus:border-[#B79661]'
        } ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full min-h-[100px] px-4 py-3 rounded-xl bg-[#FFFFFF] border text-xs sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] transition-all focus:outline-none focus:ring-2 focus:ring-[#B79661] ${
          error
            ? 'border-[#DC2626] focus:ring-[#DC2626]'
            : 'border-[#D9DDE2] focus:border-[#B79661]'
        } ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFFFF] border text-xs sm:text-sm text-[#1F2937] transition-all focus:outline-none focus:ring-2 focus:ring-[#B79661] ${
          error
            ? 'border-[#DC2626] focus:ring-[#DC2626]'
            : 'border-[#D9DDE2] focus:border-[#B79661]'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
