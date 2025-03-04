'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useExtendedUserProfile,
  useUserStatistics,
} from '@/hooks/profile-hooks'
import { useGameRounds } from '@/hooks/game-hooks'
import { useUserBets } from '@/hooks/game-hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'

interface DashboardContentProps {
  userId: string
}

export default function DashboardContent({ userId }: DashboardContentProps) {
  const router = useRouter()
  const [welcomeBannerVisible, setWelcomeBannerVisible] = useState(true)

  // Fetch data with React Query
  const { data: profile, isLoading: profileLoading } =
    useExtendedUserProfile(userId)
  const { data: statistics, isLoading: statsLoading } =
    useUserStatistics(userId)
  const { data: activeGames, isLoading: gamesLoading } = useGameRounds('active')
  const { data: userBets, isLoading: betsLoading } = useUserBets(userId)

  const isLoading =
    profileLoading || statsLoading || gamesLoading || betsLoading

  // Recent bets (limit to 5)
  const recentBets = userBets?.slice(0, 5) || []

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Banner */}
      {welcomeBannerVisible && (
        <div className='relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg overflow-hidden'>
          <div className='px-6 py-8 md:p-10 relative z-10'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
              <div className='mb-4 md:mb-0'>
                <h2 className='text-xl md:text-2xl font-bold text-white'>
                  Xin chào, {profile?.display_name || 'Người chơi'}!
                </h2>
                <p className='mt-1 text-primary-100 text-white'>
                  Chúc bạn chơi game vui vẻ và may mắn.
                </p>
              </div>
              <div className='flex space-x-3'>
                <Button
                  variant='outline'
                  onClick={() => setWelcomeBannerVisible(false)}
                  className='bg-white/10 text-white border-white/20 hover:bg-white/20'>
                  Đóng
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => router.push('/games')}>
                  Chơi ngay
                </Button>
              </div>
            </div>
          </div>
          <div className='absolute right-0 bottom-0 h-64 w-64 opacity-10'>
            <svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
              <path
                fill='#FFFFFF'
                d='M47.1,-57.8C59.3,-47.4,66.6,-31.4,70.1,-14.6C73.6,2.2,73.3,19.8,65.9,34.1C58.5,48.4,44.1,59.6,28.2,66.1C12.4,72.7,-4.9,74.7,-21.1,69.8C-37.3,64.9,-52.4,53.1,-59.8,37.9C-67.3,22.6,-67,3.8,-63.5,-13.9C-60.1,-31.5,-53.3,-48,-41.5,-58.5C-29.6,-69.1,-12.8,-73.6,2.5,-76.7C17.9,-79.8,35.8,-81.4,47.1,-71.5Z'
                transform='translate(100 100)'
              />
            </svg>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Balance Card */}
        <Card className='bg-gradient-to-br from-accent-500 to-accent-600 border-0 shadow-lg'>
          <div className='flex flex-col h-full text-white p-4'>
            <div className='flex items-center mb-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-2 opacity-80'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              <h3 className='text-lg font-semibold opacity-90'>
                Số dư tài khoản
              </h3>
            </div>
            <div className='text-3xl font-bold mb-3'>
              {profile?.balance?.toLocaleString()} VND
            </div>
            <div className='mt-auto'>
              <Link href='/payment-request'>
                <button className='w-full mt-2 py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-md text-white text-sm'>
                  Nạp tiền
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Statistics Card */}
        <Card className='bg-gradient-to-br from-warning-500 to-warning-600 border-0 shadow-lg'>
          <div className='flex flex-col h-full text-white p-4'>
            <div className='flex items-center mb-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-2 opacity-80'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <h3 className='text-lg font-semibold opacity-90'>Thống kê</h3>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>Số lượt chơi:</span>
                <span className='font-semibold'>
                  {statistics?.total_games_played || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Lượt thắng:</span>
                <span className='font-semibold'>
                  {statistics?.games_won || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Tỷ lệ thắng:</span>
                <span className='font-semibold'>
                  {statistics?.win_rate?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <div className='mt-auto'>
              <Link href='/history'>
                <button className='w-full mt-2 py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-md text-white text-sm'>
                  Xem lịch sử
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Active Games Card */}
        <Card className='bg-gradient-to-br from-primary-500 to-primary-600 border-0 shadow-lg'>
          <div className='flex flex-col h-full text-white p-4'>
            <div className='flex items-center mb-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 mr-2 opacity-80'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
              <h3 className='text-lg font-semibold opacity-90'>
                Lượt chơi đang mở
              </h3>
            </div>
            <div className='text-3xl font-bold mb-3'>
              {activeGames?.length || 0}
            </div>
            <div className='mt-auto'>
              <Link href='/games'>
                <button className='w-full mt-2 py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-md text-white text-sm'>
                  Tham gia ngay
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Active Games */}
        <Card>
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Lượt chơi đang diễn ra
              </h3>
              <Link href='/games'>
                <Button variant='outline' size='sm'>
                  Xem tất cả
                </Button>
              </Link>
            </div>

            {activeGames?.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mx-auto h-12 w-12 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  Không có lượt chơi nào
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Hiện không có lượt chơi nào đang diễn ra.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {activeGames?.map((game) => (
                  <div
                    key={game.id}
                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <div className='flex items-center'>
                          <span className='font-medium text-gray-900'>
                            Lượt chơi #{game.id.substring(0, 8)}
                          </span>
                          <Badge variant='success' size='sm' className='ml-2'>
                            Đang diễn ra
                          </Badge>
                        </div>
                        <div className='mt-1 text-sm text-gray-500'>
                          Bắt đầu:{' '}
                          {new Date(game.start_time).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <Link href={`/games/${game.id}`}>
                        <Button variant='primary' size='sm'>
                          Đặt cược
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Bets */}
        <Card>
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Lịch sử đặt cược gần đây
              </h3>
              <Link href='/history'>
                <Button variant='outline' size='sm'>
                  Xem tất cả
                </Button>
              </Link>
            </div>

            {recentBets.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mx-auto h-12 w-12 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  Chưa có lịch sử
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Bạn chưa đặt cược lần nào.
                </p>
                <div className='mt-6'>
                  <Link href='/games'>
                    <Button variant='primary' size='sm'>
                      Đặt cược ngay
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                {recentBets.map((bet) => (
                  <div
                    key={bet.id}
                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out'>
                    <div className='flex justify-between'>
                      <div>
                        <div className='flex items-center'>
                          <span className='font-medium text-gray-900'>
                            Số đã chọn: {bet.selected_number}
                          </span>
                          {bet.game?.status === 'completed' && (
                            <span className='ml-2'>
                              {bet.is_winner ? (
                                <Badge variant='success' size='sm'>
                                  Thắng
                                </Badge>
                              ) : (
                                <Badge variant='destructive' size='sm'>
                                  Thua
                                </Badge>
                              )}
                            </span>
                          )}
                        </div>
                        <div className='mt-1 text-sm text-gray-500'>
                          {new Date(bet.created_at).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium text-gray-900'>
                          {bet.amount.toLocaleString()} VND
                        </div>
                        {bet.game?.winning_number && (
                          <div className='mt-1 text-sm text-gray-500'>
                            Số trúng: {bet.game.winning_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
