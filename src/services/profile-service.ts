// src/services/profile-service.ts
import { createClient, supabase } from '@/lib/supabase/client'
import { ExtendedProfile, UserStatistics, UserLevel } from '@/types/database'

export async function getExtendedUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as ExtendedProfile
}

export async function getUserStatistics(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_statistics')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getUserLevel(level: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_levels')
    .select('*')
    .eq('level', level)
    .single()

  if (error) throw error
  return data
}

export async function getNextUserLevel(currentLevel: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_levels')
    .select('*')
    .eq('level', currentLevel + 1)
    .single()

  if (error) throw error
  return data
}

/**
 * Cập nhật thông tin profile người dùng
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<ExtendedProfile>
) {
  // Loại bỏ các trường không được phép cập nhật trực tiếp
  const safeUpdates: Partial<ExtendedProfile> = {
    display_name: updates.display_name,
    avatar_url: updates.avatar_url,
    preferences: updates.preferences,
    two_factor_enabled: updates.two_factor_enabled,
    telegram_notif_enabled: updates.telegram_notif_enabled,
    telegram_id: updates.telegram_id,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0] as ExtendedProfile
}

/**
 * Cập nhật các tùy chọn người dùng
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Record<string, any>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0] as ExtendedProfile
}

export async function uploadProfileAvatar(userId: string, file: File) {
  const supabase = createClient()

  // Create a unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}_${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`
  const filePath = `avatars/${fileName}`

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('user_avatars')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('user_avatars')
    .getPublicUrl(filePath)

  const publicUrl = urlData.publicUrl

  // Update profile with avatar URL
  const { data, error: profileError } = await supabase
    .from('profiles')
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  if (profileError) throw profileError
  return data
}

export async function calculateExperienceToNextLevel(userId: string) {
  // Get user's current level and experience
  const profile = await getExtendedUserProfile(userId)

  try {
    // Get next level requirements
    const nextLevel = await getNextUserLevel(profile.level)

    // Get current level requirements
    const currentLevel = await getUserLevel(profile.level)

    // Calculate remaining XP needed for next level
    const currentXP = profile.experience_points
    const levelStartXP = currentLevel.experience_required
    const nextLevelXP = nextLevel.experience_required
    const totalNeededForLevel = nextLevelXP - levelStartXP
    const alreadyEarnedInLevel = currentXP - levelStartXP
    const remainingXP = nextLevelXP - currentXP
    const progress = Math.min(
      100,
      Math.max(
        0,
        Math.floor((alreadyEarnedInLevel / totalNeededForLevel) * 100)
      )
    )

    return {
      currentXP,
      currentLevelXP: levelStartXP,
      nextLevelXP,
      remainingXP,
      progress,
    }
  } catch (error) {
    // Check if the error is because there's no next level (user is at max level)
    if ((error as any).code === 'PGRST116') {
      return {
        currentXP: profile.experience_points,
        nextLevelXP: null,
        remainingXP: null,
        progress: 100,
      }
    }
    throw error
  }
}

/**
 * Tính toán tiến trình cấp độ người dùng
 */
export async function calculateLevelProgress(userId: string) {
  try {
    // Lấy profile người dùng
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('level, experience_points')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    // Lấy thông tin cấp độ hiện tại
    const { data: currentLevel, error: currentLevelError } = await supabase
      .from('user_levels')
      .select('*')
      .eq('level', profile.level)
      .single()

    if (currentLevelError) throw currentLevelError

    // Lấy thông tin cấp độ tiếp theo
    const { data: nextLevel, error: nextLevelError } = await supabase
      .from('user_levels')
      .select('*')
      .eq('level', profile.level + 1)
      .single()

    // Nếu không có level tiếp theo (đã đạt cấp độ cao nhất)
    if (nextLevelError && nextLevelError.code === 'PGRST116') {
      return {
        currentXP: profile.experience_points,
        currentLevel: profile.level,
        currentLevelName: currentLevel.name,
        currentLevelXP: currentLevel.experience_required,
        nextLevelXP: null,
        remainingXP: null,
        progress: 100,
        isMaxLevel: true,
        currentLevelBenefits: currentLevel.benefits,
      }
    }

    if (nextLevelError) throw nextLevelError

    // Tính toán tiến trình
    const currentXP = profile.experience_points
    const levelStartXP = currentLevel.experience_required
    const nextLevelXP = nextLevel.experience_required
    const totalNeededForLevel = nextLevelXP - levelStartXP
    const alreadyEarnedInLevel = currentXP - levelStartXP
    const remainingXP = nextLevelXP - currentXP
    const progress = Math.min(
      100,
      Math.max(
        0,
        Math.floor((alreadyEarnedInLevel / totalNeededForLevel) * 100)
      )
    )

    return {
      currentXP,
      currentLevel: profile.level,
      currentLevelName: currentLevel.name,
      currentLevelXP: levelStartXP,
      nextLevelXP,
      nextLevelName: nextLevel.name,
      remainingXP,
      progress,
      isMaxLevel: false,
      currentLevelBenefits: currentLevel.benefits,
      nextLevelBenefits: nextLevel.benefits,
    }
  } catch (error) {
    console.error('Error calculating level progress:', error)
    throw error
  }
}

/**
 * Lấy thông tin thống kê người dùng
 */
export async function getUserActivityStats(
  userId: string,
  period: 'week' | 'month' | 'all' = 'all'
) {
  try {
    // Lấy thống kê từ bảng user_statistics
    const { data: stats, error: statsError } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (statsError) throw statsError

    // Lấy dữ liệu đặt cược gần đây theo khoảng thời gian
    let timeConstraint = ''
    if (period === 'week') {
      timeConstraint = "created_at >= now() - interval '7 days'"
    } else if (period === 'month') {
      timeConstraint = "created_at >= now() - interval '30 days'"
    }

    // Lấy số lượng đặt cược và thắng trong khoảng thời gian
    const { data: recentBets, error: recentBetsError } = await supabase
      .from('bets')
      .select('id, amount, is_winner')
      .eq('user_id', userId)
      .filter(
        'created_at',
        'gte',
        timeConstraint
          ? `now() - interval '${period === 'week' ? '7' : '30'} days'`
          : undefined
      )

    if (recentBetsError) throw recentBetsError

    // Tính toán thống kê theo khoảng thời gian
    const totalBets = recentBets?.length || 0
    const winningBets = recentBets?.filter((bet) => bet.is_winner).length || 0
    const periodWinRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0
    const recentTotalAmount =
      recentBets?.reduce((sum, bet) => sum + (bet.amount || 0), 0) || 0

    return {
      allTime: {
        gamesPlayed: stats.total_games_played,
        gamesWon: stats.games_won,
        winRate: stats.win_rate,
        biggestWin: stats.biggest_win,
        luckyNumber: stats.lucky_number,
        totalRewards: stats.total_rewards,
      },
      recent: {
        period,
        gamesPlayed: totalBets,
        gamesWon: winningBets,
        winRate: periodWinRate,
        totalAmount: recentTotalAmount,
      },
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error)
    throw error
  }
}

/**
 * Lấy lịch sử đặt cược của người dùng
 */
export async function getUserBetHistory(userId: string, page = 1, limit = 10) {
  try {
    // Tính offset từ page và limit
    const offset = (page - 1) * limit

    // Lấy tổng số kết quả
    const { count, error: countError } = await supabase
      .from('bets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) throw countError

    // Lấy dữ liệu đặt cược với phân trang
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select(
        `
        *,
        game_round:game_round_id(
          id,
          start_time,
          end_time,
          status,
          winning_number
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (betsError) throw betsError

    return {
      data: bets,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching user bet history:', error)
    throw error
  }
}
