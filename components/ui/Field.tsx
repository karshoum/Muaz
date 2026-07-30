'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

const BASE =
  'w-full rounded-lg border border-softgray bg-white px-3 py-2.5 text-sm text-navy transition-colors placeholder:text-navy-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:bg-softgray/50';

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (id: string) => React.ReactNode;
}

export function Field({ label, hint, error, required, className, children }: FieldWrapperProps) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-navy">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      {children(id)}
      {hint && !error && <p className="text-xs text-navy-300">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(BASE, className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(BASE, 'min-h-28 resize-y', className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(BASE, 'cursor-pointer', className)} {...props}>
        {children}
      </select>
    );
  },
);

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-lg border border-softgray bg-white px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold',
        className,
      )}
    >
      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 accent-gold"
        {...props}
      />
      {label}
    </label>
  );
}
