// src/components/notifications/notification-helper.ts
import { toast } from 'react-hot-toast'

/**
 * Hiển thị thông báo thành công
 */
export const showSuccessToast = (message: string) => {
  return toast.success(message, {
    duration: 4000,
    style: {
      borderRadius: '10px',
      background: '#10b981',
      color: '#fff',
    },
  })
}

/**
 * Hiển thị thông báo lỗi
 */
export const showErrorToast = (message: string) => {
  return toast.error(message, {
    duration: 4000,
    style: {
      borderRadius: '10px',
      background: '#ef4444',
      color: '#fff',
    },
  })
}

/**
 * Hiển thị thông báo khi thắng
 */
export const showWinToast = (message: string) => {
  return toast.success(message, {
    duration: 5000,
    icon: '🎮',
    style: {
      borderRadius: '10px',
      background: '#10b981',
      color: '#fff',
      fontWeight: 'bold',
    },
  })
}

/**
 * Hiển thị thông báo thông tin
 */
export const showInfoToast = (message: string) => {
  return toast(message, {
    duration: 4000,
    icon: 'ℹ️',
    style: {
      borderRadius: '10px',
      background: '#3b82f6',
      color: '#fff',
    },
  })
}
