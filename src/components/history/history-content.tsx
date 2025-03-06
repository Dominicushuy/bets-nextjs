// src/components/history/history-content.tsx
'use client'

import { useState, useEffect } from 'react'
import { useUserBets } from '@/hooks/game-hooks'
import { useUserPaymentRequests } from '@/hooks/payment-hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import Pagination from '@/components/ui/pagination'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Calendar, Filter, Download } from 'lucide-react'
import Link from 'next/link'

interface HistoryContentProps {
  userId: string
}

export default function HistoryContent({ userId }: HistoryContentProps) {
  const [activeTab, setActiveTab] = useState<'bets' | 'payments'>('bets')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dateRange, setDateRange] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: bets, isLoading: betsLoading } = useUserBets(userId)
  const { data: payments, isLoading: paymentsLoading } =
    useUserPaymentRequests(userId)

  // Filtered data based on filters
  const [filteredBets, setFilteredBets] = useState<any[]>([])
  const [filteredPayments, setFilteredPayments] = useState<any[]>([])

  // Update filtered data when raw data or filters change
  useEffect(() => {
    if (bets) {
      let filtered = [...bets]

      // Apply date filter
      if (dateRange !== 'all') {
        const now = new Date()
        const startDate = new Date()

        if (dateRange === 'today') {
          startDate.setHours(0, 0, 0, 0)
        } else if (dateRange === 'week') {
          startDate.setDate(now.getDate() - 7)
        } else if (dateRange === 'month') {
          startDate.setMonth(now.getMonth() - 1)
        }

        filtered = filtered.filter(
          (bet) => new Date(bet.created_at) >= startDate
        )
      }

      // Apply status filter for bets
      if (statusFilter !== 'all') {
        if (statusFilter === 'win') {
          filtered = filtered.filter((bet) => bet.is_winner === true)
        } else if (statusFilter === 'lose') {
          filtered = filtered.filter((bet) => bet.is_winner === false)
        } else if (statusFilter === 'pending') {
          filtered = filtered.filter((bet) => bet.is_winner === null)
        }
      }

      setFilteredBets(filtered)
    }
  }, [bets, dateRange, statusFilter])

  useEffect(() => {
    if (payments) {
      let filtered = [...payments]

      // Apply date filter
      if (dateRange !== 'all') {
        const now = new Date()
        const startDate = new Date()

        if (dateRange === 'today') {
          startDate.setHours(0, 0, 0, 0)
        } else if (dateRange === 'week') {
          startDate.setDate(now.getDate() - 7)
        } else if (dateRange === 'month') {
          startDate.setMonth(now.getMonth() - 1)
        }

        filtered = filtered.filter(
          (payment) => new Date(payment.request_date) >= startDate
        )
      }

      // Apply status filter for payments
      if (
        statusFilter !== 'all' &&
        statusFilter !== 'win' &&
        statusFilter !== 'lose'
      ) {
        filtered = filtered.filter((payment) => payment.status === statusFilter)
      }

      setFilteredPayments(filtered)
    }
  }, [payments, dateRange, statusFilter])

  // Paginated data
  const paginatedBets = filteredBets.slice((page - 1) * limit, page * limit)
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * limit,
    page * limit
  )

  const isLoading =
    (activeTab === 'bets' && betsLoading) ||
    (activeTab === 'payments' && paymentsLoading)
  const totalPages = Math.ceil(
    (activeTab === 'bets' ? filteredBets.length : filteredPayments.length) /
      limit
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant='warning'>Đang chờ</Badge>
      case 'approved':
        return <Badge variant='success'>Đã duyệt</Badge>
      case 'rejected':
        return <Badge variant='destructive'>Từ chối</Badge>
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const exportToCSV = () => {
    const data = activeTab === 'bets' ? filteredBets : filteredPayments
    if (!data.length) return

    let csvContent = 'data:text/csv;charset=utf-8,'

    // Headers
    const headers =
      activeTab === 'bets'
        ? ['Số đã chọn', 'Số tiền', 'Thời gian', 'Số trúng', 'Kết quả']
        : ['Số tiền', 'Ngày yêu cầu', 'Trạng thái', 'Ngày xử lý', 'Ghi chú']

    csvContent += headers.join(',') + '\n'

    // Data rows
    if (activeTab === 'bets') {
      data.forEach((bet) => {
        const row = [
          `"${bet.selected_number}"`,
          bet.amount,
          new Date(bet.created_at).toLocaleString('vi-VN'),
          `"${bet.game?.winning_number || '-'}"`,
          bet.is_winner === true
            ? 'Thắng'
            : bet.is_winner === false
            ? 'Thua'
            : 'Đang xử lý',
        ]
        csvContent += row.join(',') + '\n'
      })
    } else {
      data.forEach((payment) => {
        const row = [
          payment.amount,
          new Date(payment.request_date).toLocaleString('vi-VN'),
          payment.status,
          payment.processed_date
            ? new Date(payment.processed_date).toLocaleString('vi-VN')
            : '-',
          `"${payment.notes || '-'}"`,
        ]
        csvContent += row.join(',') + '\n'
      })
    }

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `${activeTab}_history_${new Date().toISOString().split('T')[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className='mb-6'>
        <div className='flex border-b'>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'bets'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('bets')
              setPage(1)
              setStatusFilter('all')
            }}>
            Lịch sử đặt cược
          </button>

          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'payments'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => {
              setActiveTab('payments')
              setPage(1)
              setStatusFilter('all')
            }}>
            Lịch sử thanh toán
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <Card className='mb-6'>
        <div className='p-4'>
          <div className='flex flex-wrap gap-4 items-center'>
            <div className='flex items-center'>
              <Filter className='h-4 w-4 mr-2 text-gray-500' />
              <span className='text-sm font-medium'>Lọc:</span>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>Thời gian:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className='text-sm border rounded-md px-2 py-1'>
                <option value='all'>Tất cả</option>
                <option value='today'>Hôm nay</option>
                <option value='week'>7 ngày qua</option>
                <option value='month'>30 ngày qua</option>
              </select>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='text-sm border rounded-md px-2 py-1'>
                <option value='all'>Tất cả</option>
                {activeTab === 'bets' ? (
                  <>
                    <option value='win'>Thắng</option>
                    <option value='lose'>Thua</option>
                    <option value='pending'>Đang xử lý</option>
                  </>
                ) : (
                  <>
                    <option value='pending'>Đang chờ</option>
                    <option value='approved'>Đã duyệt</option>
                    <option value='rejected'>Từ chối</option>
                  </>
                )}
              </select>
            </div>

            <div className='flex items-center space-x-2 ml-auto'>
              <Button
                variant='outline'
                size='sm'
                onClick={exportToCSV}
                disabled={
                  activeTab === 'bets'
                    ? filteredBets.length === 0
                    : filteredPayments.length === 0
                }>
                <Download className='h-4 w-4 mr-1' />
                Xuất CSV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {activeTab === 'bets' && (
        <Card>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>Lịch sử đặt cược</h3>

            {filteredBets.length === 0 ? (
              <div className='text-center py-6 text-gray-500'>
                <p>Bạn chưa có lịch sử đặt cược nào</p>
                <Link href='/games'>
                  <Button variant='primary' className='mt-4'>
                    Đặt cược ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Số đã chọn
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Số tiền
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Thời gian
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Số trúng
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Kết quả
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {paginatedBets.map((bet) => (
                        <tr key={bet.id} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {bet.selected_number}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {formatCurrency(bet.amount)}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {formatDateTime(bet.created_at)}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {bet.game?.winning_number || '-'}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm'>
                            {bet.game?.status === 'completed' ? (
                              bet.is_winner ? (
                                <Badge variant='success'>Thắng</Badge>
                              ) : (
                                <Badge variant='destructive'>Thua</Badge>
                              )
                            ) : (
                              <Badge variant='secondary'>
                                {bet.game?.status === 'active'
                                  ? 'Đang diễn ra'
                                  : 'Chưa có kết quả'}
                              </Badge>
                            )}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-primary-600'>
                            {bet.game && (
                              <Link href={`/games/${bet.game.id}`}>
                                Xem chi tiết
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='mt-6'>
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <div className='p-6'>
            <h3 className='text-lg font-medium mb-4'>Lịch sử thanh toán</h3>

            {filteredPayments.length === 0 ? (
              <div className='text-center py-6 text-gray-500'>
                <p>Bạn chưa có lịch sử thanh toán nào</p>
                <Link href='/payment-request'>
                  <Button variant='primary' className='mt-4'>
                    Tạo yêu cầu nạp tiền
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Số tiền
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Ngày yêu cầu
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Trạng thái
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Ngày xử lý
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Ghi chú
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Ảnh minh chứng
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {paginatedPayments.map((payment) => (
                        <tr key={payment.id} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {formatDateTime(payment.request_date)}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm'>
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {payment.processed_date
                              ? formatDateTime(payment.processed_date)
                              : '-'}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {payment.notes || '-'}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                            {payment.proof_image ? (
                              <a
                                href={payment.proof_image}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-primary-600 hover:underline'>
                                Xem ảnh
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='mt-6'>
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
