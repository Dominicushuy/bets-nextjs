// src/components/ui/textarea.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      containerClassName,
      labelClassName,
      errorClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-1', containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'block text-sm font-medium text-gray-700',
              labelClassName
            )}>
            {label}
            {props.required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}
        <div className='relative rounded-md'>
          <textarea
            className={cn(
              'block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className={cn('text-sm text-red-600', errorClassName)}>{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
