// src/components/ui/pagination.tsx
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className = '',
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first, last, and pages around current
    const pages = [1]

    // Add ellipsis and pages around current if not at the beginning
    if (currentPage > 3) {
      pages.push(-1) // Represents ellipsis
    }

    // Calculate range around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if not at the end
    if (currentPage < totalPages - 2) {
      pages.push(-2) // Represents ellipsis
    }

    // Add last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className={`flex justify-center items-center space-x-1 ${className}`}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='p-2'>
        <ChevronLeft className='h-4 w-4' />
        <span className='sr-only'>Previous page</span>
      </Button>

      {showPageNumbers && totalPages > 1 && (
        <>
          {getPageNumbers().map((page, index) => {
            if (page < 0) {
              // This is an ellipsis
              return (
                <span key={`ellipsis-${index}`} className='px-2'>
                  ...
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                size='sm'
                onClick={() => onPageChange(page)}
                className='min-w-[2rem]'>
                {page}
              </Button>
            )
          })}
        </>
      )}

      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='p-2'>
        <ChevronRight className='h-4 w-4' />
        <span className='sr-only'>Next page</span>
      </Button>
    </div>
  )
}
