// src/components/ui/radio-group.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  name: string
  value?: string | number
  onChange?: (value: string) => void
  label?: string
  error?: string
  className?: string
  orientation?: 'horizontal' | 'vertical'
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export function RadioGroup({
  options,
  name,
  value,
  onChange,
  label,
  error,
  className,
  orientation = 'vertical',
  containerClassName,
  labelClassName,
  errorClassName,
}: RadioGroupProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium text-gray-700',
            labelClassName
          )}>
          {label}
        </label>
      )}
      <div
        className={cn(
          'space-y-4',
          orientation === 'horizontal' && 'flex flex-wrap space-y-0 gap-4',
          className
        )}>
        {options.map((option) => (
          <div key={option.value} className='flex items-start'>
            <div className='flex items-center h-5'>
              <input
                id={`${name}-${option.value}`}
                name={name}
                type='radio'
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={option.disabled}
                className='h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>
            <div className='ml-3 text-sm'>
              <label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'font-medium text-gray-700',
                  option.disabled && 'opacity-50'
                )}>
                {option.label}
              </label>
              {option.description && (
                <p
                  className={cn(
                    'text-gray-500',
                    option.disabled && 'opacity-50'
                  )}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className={cn('text-sm text-red-600', errorClassName)}>{error}</p>
      )}
    </div>
  )
}
