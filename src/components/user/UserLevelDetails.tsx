// src/components/user/UserLevelDetails.tsx
import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import LevelBadge from './LevelBadge'
import { useLevelBenefits } from '@/hooks/statistics-hooks'
import { Award, TrendingUp, ChevronRight, Gift } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface UserLevelDetailsProps {
  userId: string
  className?: string
}

export default function UserLevelDetails({
  userId,
  className,
}: UserLevelDetailsProps) {
  const { data, isLoading, error } = useLevelBenefits(userId)

  if (isLoading) {
    return (
      <Card className={`p-6 animate-pulse ${className}`}>
        <div className='h-4 w-1/3 bg-gray-200 rounded mb-4'></div>
        <div className='h-3 w-full bg-gray-200 rounded mb-4'></div>
        <div className='space-y-2'>
          <div className='h-3 w-full bg-gray-200 rounded'></div>
          <div className='h-3 w-2/3 bg-gray-200 rounded'></div>
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className='text-center text-red-500'>
          <p>Không thể tải thông tin cấp độ</p>
        </div>
      </Card>
    )
  }

  const { currentLevel, nextLevel, isMaxLevel } = data
  const currentBenefits = currentLevel.benefits || {}
  const nextBenefits = nextLevel?.benefits || {}

  // Format benefits for display
  const formatBenefit = (key: string, value: any) => {
    switch (key) {
      case 'bonus_percent':
        return `Thưởng ${value}% với mỗi lần thắng`
      case 'daily_bonus':
        return `Thưởng hàng ngày: ${formatCurrency(value)}`
      case 'max_withdrawal':
        return `Rút tối đa: ${formatCurrency(value)}/ngày`
      case 'vip_support':
        return value ? 'Hỗ trợ VIP' : 'Hỗ trợ tiêu chuẩn'
      default:
        return `${key}: ${value}`
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold flex items-center'>
          <Award className='mr-2 h-5 w-5 text-primary-500' />
          Cấp độ tài khoản
        </h3>
        <LevelBadge
          level={currentLevel.level}
          levelName={currentLevel.name}
          size='md'
          showName={true}
        />
      </div>

      {!isMaxLevel && nextLevel && (
        <div className='mb-6'>
          <div className='flex justify-between mb-1 text-sm'>
            <span>
              Cấp {currentLevel.level} - {currentLevel.name}
            </span>
            <span>
              Cấp {nextLevel.level} - {nextLevel.name}
            </span>
          </div>
          <Progress value={data.progress || 0} className='h-2.5' />
          <p className='text-sm text-gray-500 mt-2'>
            <TrendingUp className='inline h-4 w-4 mr-1' />
            {data.remainingXP} XP nữa để lên cấp {nextLevel.level}
          </p>
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-medium flex items-center mb-2'>
            <Gift className='h-4 w-4 mr-1 text-primary-500' />
            Đặc quyền hiện tại
          </h4>
          <ul className='space-y-1.5 ml-6 list-disc text-sm text-gray-600'>
            {Object.entries(currentBenefits).map(([key, value]) => (
              <li key={key}>{formatBenefit(key, value)}</li>
            ))}
          </ul>
        </div>

        {!isMaxLevel && nextLevel && (
          <div>
            <h4 className='text-sm font-medium flex items-center mb-2'>
              <ChevronRight className='h-4 w-4 mr-1 text-primary-500' />
              Đặc quyền cấp tiếp theo
            </h4>
            <ul className='space-y-1.5 ml-6 list-disc text-sm text-gray-600'>
              {Object.entries(nextBenefits).map(([key, value]) => {
                const currentValue = currentBenefits[key]
                const isImproved = value > currentValue
                return (
                  <li
                    key={key}
                    className={isImproved ? 'text-green-600 font-medium' : ''}>
                    {formatBenefit(key, value)}
                    {isImproved &&
                      typeof value === 'number' &&
                      currentValue && (
                        <span className='text-xs ml-1'>
                          (+{value - currentValue})
                        </span>
                      )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
