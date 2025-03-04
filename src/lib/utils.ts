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
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('vi-VN')
}

/**
 * Format ngày sang định dạng Việt Nam
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

/**
 * Rút gọn chuỗi nếu quá dài
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
