// src/components/ui/form.tsx
import React from 'react'
import { cn } from '@/lib/utils'

// Form Container
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export function Form({ className, children, ...props }: FormProps) {
  return (
    <form className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  )
}

// Form Section
interface FormSectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function FormSection({
  children,
  title,
  description,
  className,
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className='space-y-1'>
          {title && (
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              {title}
            </h3>
          )}
          {description && (
            <p className='text-sm text-gray-500'>{description}</p>
          )}
        </div>
      )}
      <div className='space-y-4'>{children}</div>
    </div>
  )
}

// Form Group
interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

// Form Row (for horizontal layout)
interface FormRowProps {
  children: React.ReactNode
  className?: string
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}>
      {children}
    </div>
  )
}

// Form Divider
interface FormDividerProps {
  className?: string
}

export function FormDivider({ className }: FormDividerProps) {
  return <hr className={cn('my-6 border-gray-200', className)} />
}

// Form Actions
interface FormActionsProps {
  children: React.ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div
      className={cn('flex items-center justify-end space-x-3 pt-4', className)}>
      {children}
    </div>
  )
}
