// src/components/rewards/rewards-content.tsx
'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  useUserRewards,
  useRewardStats,
  useRedeemReward,
} from '@/hooks/reward-hooks'
import { formatCurrency } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'
import GameRewardCard from '@/components/game/game-reward-card'
import RewardDetailDialog from '@/components/rewards/reward-detail-dialog'
import { toast } from 'react-hot-toast'
import { RewardCode } from '@/types/database'
import {
  Gift,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Filter,
  ArrowUpDown,
  Search,
  RefreshCw,
  SlidersHorizontal,
  AlertTriangle,
  X,
} from 'lucide-react'

interface RewardsContentProps {
  userId: string
  initialRewards?: any[]
}

export default function RewardsContent({
  userId,
  initialRewards = [],
}: RewardsContentProps) {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'available' | 'used' | 'expired'
  >('all')
  const [sortOrder, setSortOrder] = useState<
    'newest' | 'oldest' | 'valueDesc' | 'valueAsc'
  >('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReward, setSelectedReward] = useState<RewardCode | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showExpiredWarning, setShowExpiredWarning] = useState(true)

  const { data: rewards, isLoading, refetch } = useUserRewards(userId)
  const { data: stats, isLoading: statsLoading } = useRewardStats(userId)
  const { mutate: redeemReward } = useRedeemReward()

  const allRewards = rewards || initialRewards

  // Kiểm tra xem có rewards nào sắp hết hạn không (trong vòng 24h)
  const expiringRewards = useMemo(() => {
    if (!allRewards) return []

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(now.getHours() + 24)

    return allRewards.filter(
      (reward) =>
        !reward.is_used &&
        new Date(reward.expiry_date) > now &&
        new Date(reward.expiry_date) < tomorrow
    )
  }, [allRewards])

  // Filter rewards
  const filteredRewards = useMemo(() => {
    if (!allRewards) return []

    return allRewards
      .filter((reward) => {
        // Apply status filter
        if (statusFilter !== 'all') {
          const isExpired = new Date(reward.expiry_date) < new Date()

          if (statusFilter === 'available' && (reward.is_used || isExpired))
            return false
          if (statusFilter === 'used' && !reward.is_used) return false
          if (statusFilter === 'expired' && (reward.is_used || !isExpired))
            return false
        }

        // Apply search filter
        if (
          searchTerm &&
          !reward.code.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        // Apply sorting
        switch (sortOrder) {
          case 'newest':
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
          case 'oldest':
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            )
          case 'valueDesc':
            return b.amount - a.amount
          case 'valueAsc':
            return a.amount - b.amount
          default:
            return 0
        }
      })
  }, [allRewards, statusFilter, sortOrder, searchTerm])

  // Xử lý đổi nhanh tất cả phần thưởng khả dụng
  const handleRedeemAll = () => {
    const availableRewards = allRewards.filter((reward) => {
      const isExpired = new Date(reward.expiry_date) < new Date()
      return !reward.is_used && !isExpired
    })

    if (availableRewards.length === 0) {
      toast.error('Không có phần thưởng nào khả dụng để đổi')
      return
    }

    // Hiển thị xác nhận
    if (
      confirm(
        `Bạn chắc chắn muốn đổi tất cả ${availableRewards.length} phần thưởng khả dụng?`
      )
    ) {
      // Đổi từng phần thưởng một
      let successCount = 0

      const redeemNext = (index = 0) => {
        if (index >= availableRewards.length) {
          // Hoàn thành tất cả
          toast.success(
            `Đã đổi thành công ${successCount}/${availableRewards.length} phần thưởng`
          )
          refetch()
          return
        }

        const reward = availableRewards[index]
        redeemReward(reward.code, {
          onSuccess: () => {
            successCount++
            // Đổi phần thưởng tiếp theo
            redeemNext(index + 1)
          },
          onError: (error) => {
            console.error('Lỗi khi đổi phần thưởng:', error)
            // Vẫn tiếp tục với phần thưởng tiếp theo
            redeemNext(index + 1)
          },
        })
      }

      // Bắt đầu quá trình đổi thưởng
      redeemNext()
    }
  }

  // Xử lý khi đổi thưởng thành công
  const handleRewardRedeemed = () => {
    setShowDetailDialog(false)
    refetch()
    toast.success('Đổi thưởng thành công! Số dư đã được cập nhật.')
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      {/* Expiring rewards warning */}
      {showExpiredWarning && expiringRewards.length > 0 && (
        <div className='bg-warning-50 border border-warning-200 rounded-lg p-4 flex items-start'>
          <AlertTriangle className='text-warning-500 h-5 w-5 mt-0.5 flex-shrink-0 mr-3' />
          <div className='flex-1'>
            <h3 className='font-medium text-warning-800'>
              Phần thưởng sắp hết hạn!
            </h3>
            <p className='text-sm text-warning-700 mt-1'>
              Bạn có {expiringRewards.length} phần thưởng sẽ hết hạn trong vòng
              24 giờ tới.
              <Button
                variant='link'
                className='text-warning-700 font-medium px-0 py-0 h-auto'
                onClick={() => {
                  setStatusFilter('available')
                  setSearchTerm('')
                }}>
                Xem ngay
              </Button>
            </p>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='flex-shrink-0 text-warning-700 hover:text-warning-800 hover:bg-warning-100 -mr-2'
            onClick={() => setShowExpiredWarning(false)}>
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='bg-gradient-to-br from-primary-500 to-primary-600 text-white'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-sm font-medium opacity-90'>
                  Tổng phần thưởng
                </h3>
                <p className='text-2xl font-bold mt-1'>
                  {stats?.totalRewards || 0}
                </p>
              </div>
              <Gift className='h-8 w-8 opacity-80' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-500 to-green-600 text-white'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-sm font-medium opacity-90'>Khả dụng</h3>
                <p className='text-2xl font-bold mt-1'>
                  {stats?.pendingCount || 0}
                </p>
              </div>
              <Zap className='h-8 w-8 opacity-80' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-sm font-medium opacity-90'>Đã sử dụng</h3>
                <p className='text-2xl font-bold mt-1'>
                  {stats?.redeemedCount || 0}
                </p>
              </div>
              <CheckCircle className='h-8 w-8 opacity-80' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-red-500 to-red-600 text-white'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-sm font-medium opacity-90'>Hết hạn</h3>
                <p className='text-2xl font-bold mt-1'>
                  {stats?.expiredCount || 0}
                </p>
              </div>
              <XCircle className='h-8 w-8 opacity-80' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Value Card */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <Info className='h-5 w-5 mr-2 text-primary-500' />
              <h3 className='font-medium'>Tổng giá trị phần thưởng</h3>
            </div>
            <div className='flex items-center'>
              <p className='text-xl font-bold text-success-600 mr-4'>
                {formatCurrency(stats?.totalAmount || 0)}
              </p>

              {(stats?.pendingCount ?? 0) > 0 && (
                <Button
                  variant='primary'
                  size='sm'
                  onClick={handleRedeemAll}
                  className='flex items-center'>
                  <RefreshCw className='h-4 w-4 mr-1' />
                  Đổi tất cả ({stats?.pendingCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Rewards List */}
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <span>Danh sách phần thưởng</span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              className='flex items-center gap-1'>
              <RefreshCw className='h-4 w-4' />
              <span className='hidden sm:inline'>Làm mới</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Tìm kiếm mã thưởng...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500'
              />
            </div>

            <div className='flex gap-2'>
              <div className='relative'>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className='pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none bg-white'>
                  <option value='all'>Tất cả trạng thái</option>
                  <option value='available'>Khả dụng</option>
                  <option value='used'>Đã sử dụng</option>
                  <option value='expired'>Hết hạn</option>
                </select>
                <Filter className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
              </div>

              <div className='relative'>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className='pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none bg-white'>
                  <option value='newest'>Mới nhất</option>
                  <option value='oldest'>Cũ nhất</option>
                  <option value='valueDesc'>Giá trị (cao → thấp)</option>
                  <option value='valueAsc'>Giá trị (thấp → cao)</option>
                </select>
                <ArrowUpDown className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
              </div>
            </div>
          </div>

          {filteredRewards.length === 0 ? (
            <div className='text-center py-12 border border-dashed border-gray-300 rounded-lg'>
              <Gift className='h-12 w-12 mx-auto text-gray-400 mb-3' />
              <h3 className='text-lg font-medium text-gray-900'>
                Không có phần thưởng
              </h3>
              <p className='mt-1 text-gray-500'>
                {statusFilter === 'all'
                  ? 'Bạn chưa có phần thưởng nào'
                  : `Bạn chưa có phần thưởng nào ${
                      statusFilter === 'available'
                        ? 'khả dụng'
                        : statusFilter === 'used'
                        ? 'đã sử dụng'
                        : 'đã hết hạn'
                    }`}
              </p>
              {statusFilter !== 'all' && (
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => setStatusFilter('all')}>
                  Xem tất cả phần thưởng
                </Button>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {filteredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className='cursor-pointer'
                  onClick={() => {
                    setSelectedReward(reward)
                    setShowDetailDialog(true)
                  }}>
                  <GameRewardCard
                    rewardCode={reward.code}
                    amount={reward.amount}
                    isUsed={reward.is_used}
                    expiryDate={reward.expiry_date}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-start'>
            <div className='bg-primary-100 p-2 rounded-full mr-3'>
              <span className='flex items-center justify-center h-5 w-5 text-primary-600 font-semibold'>
                1
              </span>
            </div>
            <div>
              <h4 className='font-medium'>Nhận phần thưởng</h4>
              <p className='text-gray-600 text-sm mt-1'>
                Bạn nhận được phần thưởng khi thắng cược. Mỗi mã thưởng tương
                ứng với một số tiền nhất định.
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='bg-primary-100 p-2 rounded-full mr-3'>
              <span className='flex items-center justify-center h-5 w-5 text-primary-600 font-semibold'>
                2
              </span>
            </div>
            <div>
              <h4 className='font-medium'>Đổi phần thưởng</h4>
              <p className='text-gray-600 text-sm mt-1'>
                {`Nhấn "Đổi thưởng" trên mã bạn muốn đổi hoặc chọn "Đổi tất cả" để đổi nhiều phần thưởng cùng lúc. Giá trị phần thưởng sẽ được cộng vào tài khoản của bạn.`}
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='bg-primary-100 p-2 rounded-full mr-3'>
              <span className='flex items-center justify-center h-5 w-5 text-primary-600 font-semibold'>
                3
              </span>
            </div>
            <div>
              <h4 className='font-medium'>Thời hạn sử dụng</h4>
              <p className='text-gray-600 text-sm mt-1'>
                Mỗi mã thưởng có thời hạn sử dụng riêng, thường là 7 ngày kể từ
                khi nhận. Đảm bảo đổi thưởng trước khi mã hết hạn để không bị
                mất phần thưởng.
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='bg-primary-100 p-2 rounded-full mr-3'>
              <span className='flex items-center justify-center h-5 w-5 text-primary-600 font-semibold'>
                4
              </span>
            </div>
            <div>
              <h4 className='font-medium'>Chia sẻ mã QR</h4>
              <p className='text-gray-600 text-sm mt-1'>
                Bạn có thể chia sẻ mã QR của phần thưởng để người khác xác nhận.
                Nhấn vào thẻ phần thưởng để xem chi tiết và tải xuống mã QR.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Detail Dialog */}
      <RewardDetailDialog
        reward={selectedReward}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        onRedeemed={handleRewardRedeemed}
      />
    </div>
  )
}
