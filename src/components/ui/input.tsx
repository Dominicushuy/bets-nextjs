// src/components/ui/input.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      rightIcon,
      isLoading,
      containerClassName,
      labelClassName,
      errorClassName,
      disabled,
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
          {icon && (
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              {icon}
            </div>
          )}
          <input
            className={cn(
              'block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            disabled={disabled || isLoading}
            {...props}
          />
          {rightIcon && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              {rightIcon}
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

Input.displayName = 'Input'

export { Input }
