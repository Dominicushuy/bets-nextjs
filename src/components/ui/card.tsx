// src/components/ui/card.tsx
import React from 'react'
import { cn } from '@/lib/utils'

// Create context to share card properties across subcomponents
interface CardContextValue {
  compact?: boolean
  bordered?: boolean
}

const CardContext = React.createContext<CardContextValue>({
  compact: false,
  bordered: true,
})

// Main Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
}

export function Card({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  compact = false,
  ...props
}: CardProps) {
  return (
    <CardContext.Provider value={{ compact, bordered }}>
      <div
        className={cn(
          'bg-white rounded-lg overflow-hidden',
          bordered ? 'border border-gray-200' : '',
          hoverable
            ? 'transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1'
            : 'shadow-md',
          className
        )}
        {...props}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

// Card Header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export function CardHeader({
  children,
  className = '',
  actions,
  ...props
}: CardHeaderProps) {
  const { compact, bordered } = React.useContext(CardContext)

  return (
    <div
      className={cn(
        compact ? 'px-4 py-3' : 'px-6 py-4',
        bordered ? 'border-b border-gray-200' : '',
        'flex justify-between items-center',
        className
      )}
      {...props}>
      <div className='flex flex-col space-y-1.5'>{children}</div>
      {actions && <div className='flex items-center space-x-2'>{actions}</div>}
    </div>
  )
}

// Card Title component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

export function CardTitle({
  children,
  className = '',
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn('text-lg font-medium text-gray-800', className)}
      {...props}>
      {children}
    </h3>
  )
}

// Card Description component
interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

export function CardDescription({
  children,
  className = '',
  ...props
}: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-500', className)} {...props}>
      {children}
    </p>
  )
}

// Card Content component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function CardContent({
  children,
  className = '',
  ...props
}: CardContentProps) {
  const { compact } = React.useContext(CardContext)

  return (
    <div className={cn(compact ? 'p-4' : 'p-6', className)} {...props}>
      {children}
    </div>
  )
}

// Card Footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function CardFooter({
  children,
  className = '',
  ...props
}: CardFooterProps) {
  const { compact, bordered } = React.useContext(CardContext)

  return (
    <div
      className={cn(
        compact ? 'px-4 py-3' : 'px-6 py-4',
        bordered ? 'border-t border-gray-200' : '',
        'flex items-center',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

// Card Image component
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
}

export function CardImage({
  src,
  alt,
  className = '',
  ...props
}: CardImageProps) {
  return (
    <div className='w-full overflow-hidden'>
      <img
        src={src}
        alt={alt}
        className={cn('w-full object-cover', className)}
        {...props}
      />
    </div>
  )
}

// Preserve backwards compatibility
interface LegacyCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
  footer?: React.ReactNode
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  headerActions?: React.ReactNode
}

export function LegacyCard({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  hoverable = false,
  bordered = true,
  compact = false,
  headerActions,
}: LegacyCardProps) {
  return (
    <Card
      className={className}
      hoverable={hoverable}
      bordered={bordered}
      compact={compact}>
      {/* Card Header */}
      {(title || headerActions) && (
        <CardHeader className={headerClassName} actions={headerActions}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}

      {/* Card Body */}
      <CardContent className={bodyClassName}>{children}</CardContent>

      {/* Card Footer */}
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  )
}
