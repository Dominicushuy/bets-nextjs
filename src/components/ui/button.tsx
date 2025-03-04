// src/components/ui/button.tsx
import React from 'react'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'outline'
    | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  rounded?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = 'button',
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      loading = false,
      rounded = false,
      ...props
    },
    ref
  ) => {
    // Base classes for all buttons
    const baseClasses =
      'font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2'

    // Define class mapping for different variants
    const variantStyles = {
      primary:
        'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 text-white',
      secondary:
        'bg-secondary-500 hover:bg-secondary-600 focus:ring-secondary-500 text-white',
      success:
        'bg-success-500 hover:bg-success-600 focus:ring-success-500 text-white',
      danger:
        'bg-danger-500 hover:bg-danger-600 focus:ring-danger-500 text-white',
      warning:
        'bg-warning-500 hover:bg-warning-600 focus:ring-warning-500 text-white',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    }

    // Size classes
    const sizeClasses = {
      xs: 'text-xs px-2 py-1',
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
      xl: 'text-lg px-7 py-4',
    }

    // Additional conditional classes
    const widthClass = fullWidth ? 'w-full' : ''
    const roundedClass = rounded ? 'rounded-full' : 'rounded-md'
    const disabledClass =
      disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    const shadowClass =
      variant !== 'ghost' && variant !== 'outline' ? 'shadow-sm' : ''

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          baseClasses,
          variantStyles[variant],
          sizeClasses[size],
          widthClass,
          roundedClass,
          disabledClass,
          shadowClass,
          'flex items-center justify-center',
          className
        )}
        {...props}>
        {loading && <Loader className='w-4 h-4 mr-2 animate-spin' />}

        {icon && iconPosition === 'left' && !loading && (
          <span className='mr-2'>{icon}</span>
        )}

        {children}

        {icon && iconPosition === 'right' && (
          <span className='ml-2'>{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
