// src/components/ui/pagination.tsx
import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const maxPageItems = 5 // Số lượng nút trang tối đa
    const pages: (number | string)[] = []

    if (totalPages <= maxPageItems) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Luôn hiển thị trang đầu, trang cuối và trang hiện tại
      // Cùng với 1-2 trang trước/sau trang hiện tại
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div
      className={cn('flex items-center justify-center space-x-2', className)}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        &laquo; Trước
      </Button>

      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <Button
              variant={currentPage === page ? 'primary' : 'outline'}
              size='sm'
              onClick={() => onPageChange(page)}
              className='min-w-[2.5rem]'
              disabled={currentPage === page}>
              {page}
            </Button>
          ) : (
            <span className='px-2'>...</span>
          )}
        </React.Fragment>
      ))}

      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        Sau &raquo;
      </Button>
    </div>
  )
}
