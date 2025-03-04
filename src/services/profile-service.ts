// src/services/profile-service.ts
import { createClient } from '@/lib/supabase/client'
// import { ExtendedProfile, UserStatistics, UserLevel } from '@/types/database'

export async function getExtendedUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
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

export async function updateUserProfile(
  userId: string,
  updates: Partial<any> // Sử dụng ExtendedProfile khi import từ types
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()

  if (error) throw error
  return data
}

export async function updateUserPreferences(
  userId: string,
  preferences: Record<string, any>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({
      preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()

  if (error) throw error
  return data
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
