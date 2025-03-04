// src/components/ui/dialog.tsx
'use client'

import React from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}: DialogProps) {
  return (
    <Transition appear show={open} as={React.Fragment}>
      <HeadlessDialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={React.Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <HeadlessDialog.Panel
                className={cn(
                  'w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all',
                  className
                )}>
                {showCloseButton && (
                  <button
                    type='button'
                    className='absolute top-3 right-3 text-gray-400 hover:text-gray-500'
                    onClick={onClose}>
                    <span className='sr-only'>Close</span>
                    <X className='h-5 w-5' />
                  </button>
                )}

                {title && (
                  <HeadlessDialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'>
                    {title}
                  </HeadlessDialog.Title>
                )}

                {description && (
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>{description}</p>
                  </div>
                )}

                <div className={cn(title ? 'mt-4' : '')}>{children}</div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
