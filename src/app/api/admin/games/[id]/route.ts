// src/app/api/admin/games/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra quyền admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can access this endpoint' },
        { status: 403 }
      )
    }

    // Lấy thông tin lượt chơi
    const { data: game, error: gameError } = await supabase
      .from('game_rounds')
      .select('*, creator:created_by(phone)')
      .eq('id', gameId)
      .single()

    if (gameError) {
      return NextResponse.json(
        { error: 'Game round not found' },
        { status: 404 }
      )
    }

    // Lấy thông tin người đặt cược
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('*, user:user_id(phone, display_name)')
      .eq('game_round_id', gameId)
      .order('created_at', { ascending: false })

    if (betsError) {
      console.error('Error fetching bets:', betsError)
    }

    return NextResponse.json({
      game,
      bets: bets || [],
    })
  } catch (error: any) {
    console.error('Error fetching game round:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching game round' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra quyền admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can update game rounds' },
        { status: 403 }
      )
    }

    // Lấy thông tin lượt chơi hiện tại
    const { data: existingGame, error: getError } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('id', gameId)
      .single()

    if (getError) {
      return NextResponse.json(
        { error: 'Game round not found' },
        { status: 404 }
      )
    }

    // Chỉ cho phép cập nhật khi lượt chơi ở trạng thái pending hoặc active
    if (!['pending', 'active'].includes(existingGame.status)) {
      return NextResponse.json(
        { error: 'Only pending or active game rounds can be updated' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { start_time, status } = body

    // Validate start_time và status
    if (status && !['pending', 'active'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Only pending or active is allowed' },
        { status: 400 }
      )
    }

    // Cập nhật lượt chơi
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (start_time) updateData.start_time = start_time
    if (status) updateData.status = status

    const { data: updatedGame, error: updateError } = await supabase
      .from('game_rounds')
      .update(updateData)
      .eq('id', gameId)
      .select('*')
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Error updating game round' },
        { status: 500 }
      )
    }

    // Log action
    await supabase.from('system_logs').insert({
      action_type: 'game_updated',
      description: `Game round ${gameId} updated by admin ${user.id}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ data: updatedGame })
  } catch (error: any) {
    console.error('Error updating game round:', error)
    return NextResponse.json(
      { error: error.message || 'Error updating game round' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const supabase = createClient()

    // Lấy thông tin người dùng hiện tại
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra quyền admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admin can delete game rounds' },
        { status: 403 }
      )
    }

    // Lấy thông tin lượt chơi hiện tại
    const { data: existingGame, error: getError } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('id', gameId)
      .single()

    if (getError) {
      return NextResponse.json(
        { error: 'Game round not found' },
        { status: 404 }
      )
    }

    // Chỉ cho phép xóa khi lượt chơi ở trạng thái pending
    if (existingGame.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending game rounds can be deleted' },
        { status: 400 }
      )
    }

    // Xóa lượt chơi
    const { error: deleteError } = await supabase
      .from('game_rounds')
      .delete()
      .eq('id', gameId)

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message || 'Error deleting game round' },
        { status: 500 }
      )
    }

    // Log action
    await supabase.from('system_logs').insert({
      action_type: 'game_deleted',
      description: `Game round ${gameId} deleted by admin ${user.id}`,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'Game round deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting game round:', error)
    return NextResponse.json(
      { error: error.message || 'Error deleting game round' },
      { status: 500 }
    )
  }
}
