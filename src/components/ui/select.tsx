// src/components/ui/select.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  label?: string
  error?: string
  icon?: React.ReactNode
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  onChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      label,
      error,
      icon,
      containerClassName,
      labelClassName,
      errorClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    }

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
          <select
            className={cn(
              'block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'appearance-none',
              icon && 'pl-10',
              'pr-10',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
            <ChevronDown className='h-4 w-4 text-gray-400' />
          </div>
        </div>
        {error && (
          <p className={cn('text-sm text-red-600', errorClassName)}>{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
