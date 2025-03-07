// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Kết hợp các class names với Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format số tiền sang định dạng VND
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0 VND'
  return `${amount.toLocaleString('vi-VN')} VND`
}

/**
 * Format ngày giờ sang định dạng Việt Nam
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) return ''

  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format ngày sang định dạng Việt Nam
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) return ''

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Rút gọn chuỗi nếu quá dài
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
