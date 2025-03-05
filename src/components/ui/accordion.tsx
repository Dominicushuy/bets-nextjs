// src/components/ui/accordion.tsx
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  titleClassName?: string
  contentClassName?: string
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
  contentClassName,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border-b border-gray-200 last:border-b-0', className)}>
      <button
        type='button'
        className={cn(
          'flex w-full items-center justify-between py-4 text-left font-medium text-gray-900',
          titleClassName
        )}
        onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className='ml-6 flex-shrink-0'>
          {isOpen ? (
            <ChevronUp className='h-5 w-5 text-gray-500' />
          ) : (
            <ChevronDown className='h-5 w-5 text-gray-500' />
          )}
        </span>
      </button>
      <div
        className={cn(
          'transition-all duration-200 ease-in-out overflow-hidden',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}>
        <div className={cn('pb-4', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-gray-200', className)}>{children}</div>
  )
}
