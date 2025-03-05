// src/components/auth/change-password-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useChangePassword } from '@/hooks/auth-hooks'

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { mutate: changePassword, isPending } = useChangePassword()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại là bắt buộc'
    }

    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          // Reset form
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
        onError: (error: any) => {
          if (error.message.includes('không chính xác')) {
            setErrors({ currentPassword: error.message })
          } else {
            setErrors({ form: error.message })
          }
        },
      }
    )
  }

  return (
    <form className='space-y-5' onSubmit={handleSubmit}>
      {errors.form && (
        <div className='p-3 bg-red-100 text-red-700 rounded-md text-sm'>
          {errors.form}
        </div>
      )}

      <div>
        <label
          htmlFor='currentPassword'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Mật khẩu hiện tại
        </label>
        <div className='relative mt-1 rounded-md'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <LockIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='currentPassword'
            name='currentPassword'
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value)
              if (errors.currentPassword) {
                const newErrors = { ...errors }
                delete newErrors.currentPassword
                setErrors(newErrors)
              }
            }}
            className={`block w-full rounded-md border ${
              errors.currentPassword ? 'border-red-300' : 'border-gray-300'
            } py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200`}
            placeholder='Nhập mật khẩu hiện tại'
          />
          <button
            type='button'
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'>
            {showCurrentPassword ? (
              <EyeOffIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className='mt-1 text-sm text-red-600'>{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='newPassword'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Mật khẩu mới
        </label>
        <div className='relative mt-1 rounded-md'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <LockIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='newPassword'
            name='newPassword'
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              if (errors.newPassword) {
                const newErrors = { ...errors }
                delete newErrors.newPassword
                setErrors(newErrors)
              }
            }}
            className={`block w-full rounded-md border ${
              errors.newPassword ? 'border-red-300' : 'border-gray-300'
            } py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200`}
            placeholder='Nhập mật khẩu mới'
          />
          <button
            type='button'
            onClick={() => setShowNewPassword(!showNewPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'>
            {showNewPassword ? (
              <EyeOffIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className='mt-1 text-sm text-red-600'>{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Xác nhận mật khẩu mới
        </label>
        <div className='relative mt-1 rounded-md'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <LockIcon className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) {
                const newErrors = { ...errors }
                delete newErrors.confirmPassword
                setErrors(newErrors)
              }
            }}
            className={`block w-full rounded-md border ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            } py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-500
                      focus:ring-1 focus:ring-primary-500 transition-all duration-200`}
            placeholder='Xác nhận mật khẩu mới'
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'>
            {showConfirmPassword ? (
              <EyeOffIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <Button
          type='submit'
          className='w-full py-3'
          disabled={isPending}
          loading={isPending}>
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  )
}
