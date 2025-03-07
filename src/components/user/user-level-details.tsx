// src/components/user/user-level-details.tsx
'use client'

import { useLevelBenefits } from '@/hooks/statistics-hooks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Award, ChevronRight, Gift, Percent, TrendingUp } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import LevelBadge from './level-badge'
import { Badge } from '@/components/ui/badge'
import { UserLevel } from '@/types/database'

interface UserLevelDetailsProps {
  userId: string
  className?: string
}

export default function UserLevelDetails({
  userId,
  className = '',
}: UserLevelDetailsProps) {
  const { data: levelData, isLoading, error } = useLevelBenefits(userId)

  if (isLoading) {
    return <Loading />
  }

  if (error || !levelData) {
    return (
      <Card className={className}>
        <CardContent className='p-6'>
          <p className='text-red-500'>
            Không thể tải thông tin cấp độ. Vui lòng thử lại sau.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Render phúc lợi từ dữ liệu JSON
  const renderBenefits = (benefits: Record<string, any>) => {
    return Object.entries(benefits).map(([key, value]) => (
      <div key={key} className='flex items-center justify-between py-2'>
        <div className='flex items-center text-gray-700'>
          {key === 'bonus_percent' ? (
            <Percent className='h-4 w-4 mr-2 text-primary-500' />
          ) : (
            <Gift className='h-4 w-4 mr-2 text-primary-500' />
          )}
          <span className='capitalize'>
            {key === 'bonus_percent'
              ? 'Thưởng thêm khi thắng'
              : key.replace(/_/g, ' ')}
          </span>
        </div>
        <Badge variant='success'>
          {key === 'bonus_percent' ? `+${value}%` : value}
        </Badge>
      </div>
    ))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <Award className='h-5 w-5 mr-2 text-primary-500' />
            Cấp độ hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center mb-4'>
            <LevelBadge
              level={levelData.currentLevel.level}
              levelName={levelData.currentLevel.name}
              size='lg'
              showIcon
              showName
            />
            {levelData.currentLevel.icon && (
              <img
                src={levelData.currentLevel.icon}
                alt={levelData.currentLevel.name}
                className='w-16 h-16 mt-2'
              />
            )}
          </div>

          <div className='border-t pt-4 mt-2'>
            <h3 className='font-medium text-gray-900 mb-2'>
              Phúc lợi hiện tại
            </h3>
            {levelData.currentLevel.benefits ? (
              renderBenefits(levelData.currentLevel.benefits)
            ) : (
              <p className='text-gray-500 text-sm'>
                Không có phúc lợi ở cấp độ này
              </p>
            )}
          </div>

          {!levelData.isMaxLevel && levelData.nextLevel && (
            <div className='mt-6 border-t pt-4'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-medium text-gray-900'>Cấp độ tiếp theo</h3>
                <LevelBadge
                  level={levelData.nextLevel.level}
                  size='sm'
                  showIcon
                />
              </div>

              <div className='flex items-center space-x-2 mb-2'>
                <span className='text-gray-600'>
                  {levelData.nextLevel.name}
                </span>
                <ChevronRight className='h-4 w-4 text-gray-400' />
                <span className='text-primary-600 font-medium'>
                  {levelData.nextLevel.experienceRequired} XP cần thiết
                </span>
              </div>

              <div className='mt-3'>
                <h4 className='text-sm font-medium text-gray-700 mb-2'>
                  Phúc lợi mới:
                </h4>
                {levelData.nextLevel.benefits ? (
                  renderBenefits(levelData.nextLevel.benefits)
                ) : (
                  <p className='text-gray-500 text-sm'>
                    Không có phúc lợi mới ở cấp độ tiếp theo
                  </p>
                )}
              </div>
            </div>
          )}

          {levelData.isMaxLevel && (
            <div className='mt-4 text-center'>
              <Badge variant='primary' className='w-full py-2'>
                Cấp độ tối đa
              </Badge>
              <p className='mt-2 text-sm text-gray-600'>
                Bạn đã đạt cấp độ cao nhất!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <TrendingUp className='h-5 w-5 mr-2 text-primary-500' />
            Lộ trình cấp độ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {levelData.allLevels?.map((level: any) => (
              <div
                key={level.level}
                className={`p-3 border rounded-lg flex items-center justify-between ${
                  level.level === levelData.currentLevel.level
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-gray-200'
                }`}>
                <div className='flex items-center'>
                  <LevelBadge level={level.level} size='sm' />
                  <span className='ml-2 font-medium'>{level.name}</span>
                </div>
                <div className='flex items-center'>
                  {level.benefits && 'bonus_percent' in level.benefits && (
                    <Badge variant='outline' className='mr-2'>
                      +{level.benefits.bonus_percent}%
                    </Badge>
                  )}
                  <span className='text-sm text-gray-500'>
                    {level.experienceRequired} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
