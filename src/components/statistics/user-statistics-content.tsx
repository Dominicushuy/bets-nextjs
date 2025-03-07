// src/components/statistics/user-statistics-page.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useProfileStats } from '@/hooks/profile-hooks'
import {
  useLevelBenefits,
  useUserStatistics,
  useUserActivities,
} from '@/hooks/statistics-hooks'
import { Loading } from '@/components/ui/loading'
import LevelBadge from '@/components/user/LevelBadge'
import UserLevelDetails from '@/components/user/UserLevelDetails'
import UserStatsCards from '@/components/user/UserStatsCards'
import StatisticsChart from '@/components/statistics/statistics-chart'
import ActivityFeed from '@/components/statistics/activity-feed'

interface UserStatisticsContentProps {
  userId: string
}

export default function UserStatisticsContent({
  userId,
}: UserStatisticsContentProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'all'>(
    'all'
  )
  const [activitiesDays, setActivitiesDays] = useState(30)

  const { data: statsData, isLoading: statsLoading } = useUserStatistics(
    userId,
    statsPeriod
  )
  const { data: activitiesData, isLoading: activitiesLoading } =
    useUserActivities(userId, activitiesDays)
  const { data: levelData, isLoading: levelLoading } = useLevelBenefits(userId)

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'level', label: 'Cấp độ & Phúc lợi' },
    { id: 'details', label: 'Chi tiết thống kê' },
    { id: 'activities', label: 'Lịch sử hoạt động' },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const isLoading = statsLoading || levelLoading || activitiesLoading

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === 'overview' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='md:col-span-2'>
              <UserStatsCards userId={userId} />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Cấp độ hiện tại</CardTitle>
                </CardHeader>
                <CardContent>
                  {levelData && (
                    <div className='flex flex-col items-center space-y-3'>
                      <LevelBadge
                        level={levelData.currentLevel.level}
                        levelName={levelData.currentLevel.name}
                        size='lg'
                        showName={true}
                      />
                      <div className='w-full'>
                        {!levelData.isMaxLevel && (
                          <div className='space-y-2'>
                            <div className='flex justify-between text-xs text-gray-500'>
                              <span>{levelData.currentLevel.name}</span>
                              <span>{levelData.nextLevel?.name}</span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2.5'>
                              <div
                                className='bg-primary-600 h-2.5 rounded-full'
                                style={{
                                  width: `${levelData.progress}%`,
                                }}></div>
                            </div>
                            <p className='text-sm text-center'>
                              {levelData.remainingXP} XP để lên cấp
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <StatisticsChart userId={userId} />
        </div>
      )}

      {activeTab === 'level' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <UserLevelDetails userId={userId} />

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Lộ trình cấp độ</CardTitle>
            </CardHeader>
            <CardContent>
              {levelData?.allLevels && (
                <div className='space-y-4'>
                  {levelData.allLevels.map((level, index) => (
                    <div
                      key={level.level}
                      className={`
                        p-3 border rounded-lg 
                        ${
                          level.level === levelData.currentLevel.level
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }
                      `}>
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                          <LevelBadge level={level.level} size='sm' />
                          <span className='ml-2 font-medium'>{level.name}</span>
                        </div>
                        <span className='text-sm'>
                          {level.experienceRequired} XP
                        </span>
                      </div>

                      {/* Phúc lợi ngắn gọn */}
                      {level.benefits && (
                        <div className='mt-2 text-xs text-gray-600'>
                          {Object.entries(level.benefits).map(
                            ([key, value]) => (
                              <Badge
                                key={key}
                                variant='outline'
                                className='mr-2 mt-1'>
                                {key === 'bonus_percent'
                                  ? `Thưởng +${value}%`
                                  : `${key}: ${value}`}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'details' && (
        <div className='space-y-6'>
          <div className='flex space-x-2 mb-4'>
            <Badge
              variant={statsPeriod === 'week' ? 'primary' : 'outline'}
              className='cursor-pointer'
              onClick={() => setStatsPeriod('week')}>
              Tuần này
            </Badge>
            <Badge
              variant={statsPeriod === 'month' ? 'primary' : 'outline'}
              className='cursor-pointer'
              onClick={() => setStatsPeriod('month')}>
              Tháng này
            </Badge>
            <Badge
              variant={statsPeriod === 'all' ? 'primary' : 'outline'}
              className='cursor-pointer'
              onClick={() => setStatsPeriod('all')}>
              Tất cả
            </Badge>
          </div>

          <UserStatsCards userId={userId} />
          <StatisticsChart userId={userId} period={statsPeriod} />
        </div>
      )}

      {activeTab === 'activities' && (
        <div className='space-y-6'>
          <div className='flex space-x-2 mb-4'>
            <Badge
              variant={activitiesDays === 7 ? 'primary' : 'outline'}
              className='cursor-pointer'
              onClick={() => setActivitiesDays(7)}>
              7 ngày
            </Badge>
            <Badge
              variant={activitiesDays === 30 ? 'primary' : 'outline'}
              className='cursor-pointer'
              onClick={() => setActivitiesDays(30)}>
              30 ngày
            </Badge>
            <Badge
              variant={activitiesDays === 90 ? 'primary' : 'outline'}
              className='cursor-pointer'
              onClick={() => setActivitiesDays(90)}>
              90 ngày
            </Badge>
          </div>

          {activitiesData && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='md:col-span-2'>
                <ActivityFeed activities={activitiesData.activities} />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Tóm tắt hoạt động</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div>
                        <h4 className='text-sm font-medium mb-2'>Đặt cược</h4>
                        <p className='text-2xl font-bold'>
                          {activitiesData.statistics.summary.totalBets || 0}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Trong {activitiesDays} ngày qua
                        </p>
                      </div>

                      <div>
                        <h4 className='text-sm font-medium mb-2'>Thắng cược</h4>
                        <p className='text-2xl font-bold text-green-600'>
                          {activitiesData.statistics.summary.totalWins || 0}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Tỷ lệ:{' '}
                          {(
                            activitiesData.statistics.summary.averageWinRate ||
                            0
                          ).toFixed(1)}
                          %
                        </p>
                      </div>

                      <div>
                        <h4 className='text-sm font-medium mb-2'>Giao dịch</h4>
                        <p className='text-2xl font-bold'>
                          {activitiesData.recentPayments.length}
                        </p>
                        <div className='flex space-x-2 mt-1'>
                          <Badge variant='outline'>
                            Nạp:{' '}
                            {
                              activitiesData.recentPayments.filter(
                                (p) => p.status === 'approved'
                              ).length
                            }
                          </Badge>
                          <Badge variant='outline'>
                            Rút:{' '}
                            {
                              activitiesData.recentRewards.filter(
                                (r) => r.is_used
                              ).length
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
