// src/components/ui/checkbox.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
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
        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <input
              type='checkbox'
              className={cn(
                'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-red-300 focus:ring-red-500',
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className='ml-3 text-sm'>
              {label && (
                <label
                  htmlFor={props.id}
                  className={cn(
                    'font-medium text-gray-700',
                    props.disabled && 'opacity-50',
                    labelClassName
                  )}>
                  {label}
                </label>
              )}
              {description && (
                <p
                  className={cn(
                    'text-gray-500',
                    props.disabled && 'opacity-50'
                  )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className={cn('text-sm text-red-600', errorClassName)}>{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
