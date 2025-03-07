-- ================================================================
-- FILE TỔNG HỢP TRIGGERS VÀ FUNCTIONS CHO GAME CÁ CƯỢC
-- ================================================================

-- Xóa tất cả triggers và functions hiện có để tránh xung đột

-- Xóa triggers trước
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_avatar_update ON profiles;
DROP TRIGGER IF EXISTS on_bet_update ON bets;
DROP TRIGGER IF EXISTS on_game_completion ON game_rounds;
DROP TRIGGER IF EXISTS on_bet_win ON bets;
DROP TRIGGER IF EXISTS on_game_activation ON game_rounds;
DROP TRIGGER IF EXISTS on_new_bet ON bets;

-- Xóa functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS delete_old_avatar() CASCADE;
DROP FUNCTION IF EXISTS update_user_statistics() CASCADE;
DROP FUNCTION IF EXISTS get_game_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_statistics_on_game_completion() CASCADE;
DROP FUNCTION IF EXISTS place_bet(UUID, UUID, TEXT, NUMERIC) CASCADE;
DROP FUNCTION IF EXISTS complete_game_round(UUID, TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS update_user_balance(UUID, NUMERIC, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS redeem_reward(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS mark_bets_on_game_completion() CASCADE;
DROP FUNCTION IF EXISTS update_experience_on_win() CASCADE;
DROP FUNCTION IF EXISTS notify_on_new_game() CASCADE;
DROP FUNCTION IF EXISTS update_game_stats_on_new_bet() CASCADE;

-- ================================================================
-- 1. CÁC FUNCTIONS VÀ TRIGGERS QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
-- ================================================================

-- Function xử lý khi có một user mới được tạo
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Tạo bản ghi cơ bản trong profiles
  INSERT INTO public.profiles (
    id, 
    email,
    role, 
    is_active, 
    balance, 
    level,
    experience_points,
    total_wagered,
    total_won,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email,
    'user',  
    TRUE,    
    0,       
    1,       
    0,       
    0,       
    0,       
    NOW(),   
    NOW()    
  );
  
  -- Ghi log
  INSERT INTO system_logs (action_type, description, user_id, timestamp)
  VALUES ('user_created', 'New user account created with email: ' || NEW.email, NEW.id, NOW());
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger khi user mới được tạo
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Function xóa avatar cũ khi cập nhật avatar mới
CREATE OR REPLACE FUNCTION delete_old_avatar()
RETURNS TRIGGER AS $$
DECLARE
  old_avatar_url TEXT;
  old_avatar_path TEXT;
BEGIN
  -- Kiểm tra nếu avatar_url bị thay đổi
  IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url AND OLD.avatar_url IS NOT NULL THEN
    -- Extract path từ URL (Lưu ý: điều chỉnh regex này phù hợp với URL thực tế của bạn)
    old_avatar_path := regexp_replace(OLD.avatar_url, '^.+/user_avatars/(.+)$', '\1');
    
    -- Xóa file cũ từ storage
    PERFORM storage.delete('user_avatars', old_avatar_path);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger khi profile được cập nhật
CREATE TRIGGER on_avatar_update
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
EXECUTE FUNCTION delete_old_avatar();

-- Function để cập nhật số dư người dùng
CREATE OR REPLACE FUNCTION update_user_balance(
  user_id UUID,
  amount NUMERIC,
  is_increase BOOLEAN DEFAULT TRUE
) RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_new_balance NUMERIC;
BEGIN
  -- Lấy thông tin người dùng
  SELECT * INTO v_user FROM profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;
  
  -- Tính toán số dư mới
  IF is_increase THEN
    v_new_balance := v_user.balance + amount;
  ELSE
    -- Kiểm tra số dư đủ để trừ không
    IF v_user.balance < amount THEN
      RETURN jsonb_build_object('success', false, 'message', 'Insufficient balance');
    END IF;
    v_new_balance := v_user.balance - amount;
  END IF;
  
  -- Cập nhật số dư
  UPDATE profiles
  SET 
    balance = v_new_balance,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Tạo thông báo cho người dùng
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    is_read,
    created_at
  ) VALUES (
    user_id,
    CASE WHEN is_increase THEN 'Số dư tăng' ELSE 'Số dư giảm' END,
    CASE 
      WHEN is_increase THEN 'Số dư của bạn đã tăng ' || amount || ' VND'
      ELSE 'Số dư của bạn đã giảm ' || amount || ' VND'
    END,
    'payment',
    false,
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Balance updated successfully',
    'old_balance', v_user.balance,
    'new_balance', v_new_balance,
    'amount', amount,
    'is_increase', is_increase
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 2. CÁC FUNCTIONS VÀ TRIGGERS QUẢN LÝ GAME
-- ================================================================

-- Function để đặt cược cho một game round
CREATE OR REPLACE FUNCTION place_bet(
  p_user_id UUID, 
  p_game_round_id UUID, 
  p_selected_number TEXT, 
  p_amount NUMERIC
) RETURNS JSONB AS $$
DECLARE
  v_user_balance NUMERIC;
  v_game_status TEXT;
  v_result JSONB;
BEGIN
  -- Kiểm tra số dư người dùng
  SELECT balance INTO v_user_balance
  FROM profiles
  WHERE id = p_user_id;
  
  IF v_user_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;
  
  IF v_user_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'message', 'Insufficient balance');
  END IF;
  
  -- Kiểm tra trạng thái game round
  SELECT status INTO v_game_status
  FROM game_rounds
  WHERE id = p_game_round_id;
  
  IF v_game_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Game round not found');
  END IF;
  
  IF v_game_status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Game round is not active');
  END IF;
  
  -- Trừ tiền từ số dư người dùng
  UPDATE profiles
  SET 
    balance = balance - p_amount,
    total_wagered = total_wagered + p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Tạo bet mới
  INSERT INTO bets (
    user_id,
    game_round_id,
    selected_number,
    amount,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_game_round_id,
    p_selected_number,
    p_amount,
    NOW(),
    NOW()
  ) RETURNING id INTO v_result;
  
  -- Cập nhật tổng số tiền đặt cược cho game round
  UPDATE game_rounds
  SET total_bets = COALESCE(total_bets, 0) + p_amount
  WHERE id = p_game_round_id;
  
  -- Tạo thông báo cho người dùng
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_resource_id,
    related_resource_type,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    'Đặt cược thành công',
    'Bạn đã đặt cược ' || p_amount || ' VND cho số ' || p_selected_number,
    'game',
    p_game_round_id,
    'game_round',
    false,
    NOW()
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'Bet placed successfully', 'bet_id', v_result);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để hoàn thành một game round và xác định người thắng
CREATE OR REPLACE FUNCTION complete_game_round(
  p_game_id UUID,
  p_winning_number TEXT,
  p_admin_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_game_status TEXT;
  v_winner_count INTEGER := 0;
  v_total_payout NUMERIC := 0;
  v_winner_record RECORD;
  v_reward_code TEXT;
  v_bet_record RECORD;
  v_payout_multiplier NUMERIC := 80; -- Hệ số trả thưởng (80x tiền cược)
BEGIN
  -- Kiểm tra trạng thái game
  SELECT status INTO v_game_status 
  FROM game_rounds 
  WHERE id = p_game_id;
  
  IF v_game_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Game round not found');
  END IF;
  
  IF v_game_status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Game round is not active');
  END IF;
  
  -- Cập nhật kết quả và trạng thái của game round
  UPDATE game_rounds 
  SET 
    status = 'completed',
    end_time = NOW(),
    winning_number = p_winning_number,
    updated_at = NOW()
  WHERE id = p_game_id;
  
  -- Đánh dấu các bet thắng và thua
  UPDATE bets
  SET is_winner = (selected_number = p_winning_number)
  WHERE game_round_id = p_game_id;
  
  -- Xử lý các bet thắng
  FOR v_bet_record IN 
    SELECT b.id, b.user_id, b.amount, p.display_name, p.phone
    FROM bets b
    JOIN profiles p ON b.user_id = p.id
    WHERE b.game_round_id = p_game_id 
    AND b.selected_number = p_winning_number
  LOOP
    -- Tính tiền thưởng
    v_total_payout := v_total_payout + (v_bet_record.amount * v_payout_multiplier);
    
    -- Cập nhật số dư và thống kê người thắng
    UPDATE profiles
    SET 
      balance = balance + (v_bet_record.amount * v_payout_multiplier),
      total_won = total_won + (v_bet_record.amount * v_payout_multiplier),
      experience_points = experience_points + 10, -- Cộng điểm kinh nghiệm
      updated_at = NOW()
    WHERE id = v_bet_record.user_id;
    
    -- Tạo mã thưởng cho người thắng
    v_reward_code := UPPER(
      SUBSTRING(MD5(v_bet_record.id::TEXT || NOW()::TEXT) FROM 1 FOR 8)
    );
    
    INSERT INTO reward_codes (
      code,
      user_id,
      game_round_id,
      amount,
      is_used,
      expiry_date,
      created_at,
      updated_at
    ) VALUES (
      v_reward_code,
      v_bet_record.user_id,
      p_game_id,
      v_bet_record.amount * v_payout_multiplier,
      false,
      NOW() + INTERVAL '7 days',
      NOW(),
      NOW()
    );
    
    -- Tạo thông báo cho người thắng
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_resource_id,
      related_resource_type,
      is_read,
      created_at
    ) VALUES (
      v_bet_record.user_id,
      'Chúc mừng! Bạn đã thắng!',
      'Số ' || p_winning_number || ' đã trúng. Bạn đã thắng ' || 
      (v_bet_record.amount * v_payout_multiplier) || ' VND',
      'reward',
      p_game_id,
      'game_round',
      false,
      NOW()
    );
    
    v_winner_count := v_winner_count + 1;
  END LOOP;
  
  -- Cập nhật tổng số tiền thưởng cho game round
  UPDATE game_rounds
  SET total_payout = v_total_payout
  WHERE id = p_game_id;
  
  -- Ghi log system
  INSERT INTO system_logs (
    action_type,
    description,
    user_id,
    timestamp
  ) VALUES (
    'game_completed',
    'Game round ' || p_game_id || ' completed with winning number ' || p_winning_number || 
    '. Winners: ' || v_winner_count || ', Total payout: ' || v_total_payout,
    p_admin_id,
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Game round completed successfully',
    'winning_number', p_winning_number,
    'winner_count', v_winner_count,
    'total_payout', v_total_payout
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để đổi phần thưởng
CREATE OR REPLACE FUNCTION redeem_reward(
  p_code TEXT,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_reward RECORD;
BEGIN
  -- Tìm mã thưởng
  SELECT * INTO v_reward 
  FROM reward_codes
  WHERE code = p_code AND user_id = p_user_id;
  
  IF v_reward IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Reward code not found or does not belong to user');
  END IF;
  
  -- Kiểm tra xem mã đã được sử dụng chưa
  IF v_reward.is_used THEN
    RETURN jsonb_build_object('success', false, 'message', 'Reward code already used');
  END IF;
  
  -- Kiểm tra xem mã có hết hạn chưa
  IF v_reward.expiry_date < NOW() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Reward code expired');
  END IF;
  
  -- Đánh dấu mã đã sử dụng
  UPDATE reward_codes
  SET 
    is_used = TRUE,
    redeemed_date = NOW(),
    updated_at = NOW()
  WHERE id = v_reward.id;
  
  -- Cộng tiền vào tài khoản
  UPDATE profiles
  SET 
    balance = balance + v_reward.amount,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Thêm thông báo
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_resource_id,
    related_resource_type,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    'Đổi thưởng thành công',
    'Bạn đã đổi mã thưởng ' || p_code || ' với số tiền ' || v_reward.amount || ' VND',
    'reward',
    v_reward.id,
    'reward_code',
    false,
    NOW()
  );
  
  -- Ghi log
  INSERT INTO system_logs (
    action_type,
    description,
    user_id,
    timestamp
  ) VALUES (
    'reward_redeemed',
    'User redeemed reward code ' || p_code || ' for ' || v_reward.amount || ' VND',
    p_user_id,
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Reward redeemed successfully',
    'amount', v_reward.amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 3. CÁC FUNCTIONS THỐNG KÊ VÀ BÁO CÁO
-- ================================================================

-- Function để tổng hợp thống kê người dùng
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
DECLARE
  v_lucky_number TEXT;
  v_total_rewards NUMERIC;
BEGIN
  -- Kiểm tra và tạo bản ghi thống kê nếu chưa có
  INSERT INTO user_statistics (
    user_id, 
    total_games_played,
    games_won,
    win_rate,
    biggest_win,
    lucky_number,
    total_rewards,
    last_updated
  )
  VALUES (
    NEW.user_id, 
    1,
    CASE WHEN NEW.is_winner THEN 1 ELSE 0 END,
    CASE WHEN NEW.is_winner THEN 100 ELSE 0 END,
    CASE WHEN NEW.is_winner THEN NEW.amount ELSE 0 END,
    CASE WHEN NEW.is_winner THEN NEW.selected_number ELSE NULL END,
    0,
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Tìm số may mắn của người dùng (số đã giúp thắng nhiều nhất)
  SELECT selected_number INTO v_lucky_number
  FROM bets
  WHERE user_id = NEW.user_id AND is_winner = TRUE
  GROUP BY selected_number
  ORDER BY COUNT(*) DESC, MAX(created_at) DESC
  LIMIT 1;

  -- Tính tổng tiền thưởng đã nhận
  SELECT COALESCE(SUM(amount), 0) INTO v_total_rewards
  FROM reward_codes
  WHERE user_id = NEW.user_id AND is_used = TRUE;
  
  -- Cập nhật thống kê với chi tiết hơn
  WITH stats AS (
    SELECT 
      user_id,
      COUNT(*) AS total_games,
      SUM(CASE WHEN is_winner THEN 1 ELSE 0 END) AS games_won,
      CASE 
        WHEN COUNT(*) > 0 THEN
          ROUND((SUM(CASE WHEN is_winner THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        ELSE 0
      END AS win_rate
    FROM bets 
    WHERE user_id = NEW.user_id
    GROUP BY user_id
  ),
  max_win AS (
    SELECT COALESCE(MAX(amount), 0) AS biggest_win
    FROM bets
    WHERE user_id = NEW.user_id AND is_winner = TRUE
  )
  UPDATE user_statistics
  SET 
    total_games_played = stats.total_games,
    games_won = stats.games_won,
    win_rate = stats.win_rate,
    biggest_win = GREATEST(max_win.biggest_win, biggest_win),
    lucky_number = COALESCE(v_lucky_number, lucky_number),
    total_rewards = v_total_rewards,
    last_updated = NOW()
  FROM stats, max_win
  WHERE user_statistics.user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để tự động update thống kê khi game round kết thúc
CREATE OR REPLACE FUNCTION update_statistics_on_game_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ thực hiện khi game thay đổi từ active sang completed
  IF OLD.status = 'active' AND NEW.status = 'completed' THEN
    -- Thống kê có thể được cập nhật qua trigger của bets
    -- hoặc có thể thực hiện thêm ở đây nếu cần
    
    -- Ví dụ: cập nhật lại toàn bộ user_statistics cho các user tham gia game này
    WITH bet_stats AS (
      SELECT 
        user_id,
        COUNT(*) AS total_games,
        SUM(CASE WHEN is_winner THEN 1 ELSE 0 END) AS games_won
      FROM bets
      WHERE game_round_id = NEW.id
      GROUP BY user_id
    )
    UPDATE user_statistics us
    SET 
      total_games_played = us.total_games_played + bs.total_games,
      games_won = us.games_won + bs.games_won,
      win_rate = CASE 
        WHEN (us.total_games_played + bs.total_games) > 0 THEN
          ((us.games_won + bs.games_won)::FLOAT / (us.total_games_played + bs.total_games)::FLOAT) * 100
        ELSE 0
      END,
      last_updated = NOW()
    FROM bet_stats bs
    WHERE us.user_id = bs.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để lấy thống kê game
-- Cập nhật function get_game_stats để cung cấp thêm chi tiết
CREATE OR REPLACE FUNCTION get_game_stats(p_game_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_players INTEGER;
  v_total_winners INTEGER;
  v_total_bets NUMERIC;
  v_total_payout NUMERIC;
  v_game_status TEXT;
  v_winning_number TEXT;
  v_most_bet_numbers JSONB;
  v_bet_amount_distribution JSONB;
BEGIN
  -- Lấy thông tin game
  SELECT status, winning_number, COALESCE(total_bets, 0), COALESCE(total_payout, 0)
  INTO v_game_status, v_winning_number, v_total_bets, v_total_payout
  FROM game_rounds
  WHERE id = p_game_id;
  
  IF v_game_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Game round not found');
  END IF;
  
  -- Đếm số người chơi
  SELECT COUNT(DISTINCT user_id)
  INTO v_total_players
  FROM bets
  WHERE game_round_id = p_game_id;
  
  -- Đếm số người thắng
  IF v_game_status = 'completed' AND v_winning_number IS NOT NULL THEN
    SELECT COUNT(DISTINCT user_id)
    INTO v_total_winners
    FROM bets
    WHERE game_round_id = p_game_id AND selected_number = v_winning_number;
  ELSE
    v_total_winners := 0;
  END IF;
  
  -- Lấy top 5 số được đặt nhiều nhất
  WITH number_counts AS (
    SELECT selected_number, COUNT(*) AS bet_count
    FROM bets
    WHERE game_round_id = p_game_id
    GROUP BY selected_number
    ORDER BY bet_count DESC
    LIMIT 5
  )
  SELECT json_agg(json_build_object('number', selected_number, 'count', bet_count))
  INTO v_most_bet_numbers
  FROM number_counts;
  
  -- Phân phối số tiền đặt cược
  WITH amount_ranges AS (
    SELECT 
      CASE 
        WHEN amount < 50000 THEN 'under_50k'
        WHEN amount >= 50000 AND amount < 100000 THEN '50k_100k'
        WHEN amount >= 100000 AND amount < 500000 THEN '100k_500k'
        WHEN amount >= 500000 AND amount < 1000000 THEN '500k_1m'
        ELSE 'over_1m'
      END AS range,
      COUNT(*) AS bet_count
    FROM bets
    WHERE game_round_id = p_game_id
    GROUP BY range
  )
  SELECT json_object_agg(range, bet_count)
  INTO v_bet_amount_distribution
  FROM amount_ranges;
  
  RETURN jsonb_build_object(
    'totalPlayers', v_total_players,
    'totalWinners', v_total_winners,
    'totalBets', v_total_bets,
    'totalPayout', v_total_payout,
    'gameStatus', v_game_status,
    'winningNumber', v_winning_number,
    'mostBetNumbers', COALESCE(v_most_bet_numbers, '[]'::jsonb),
    'betAmountDistribution', COALESCE(v_bet_amount_distribution, '{}'::jsonb),
    'winRate', CASE WHEN v_total_players > 0 THEN (v_total_winners::float / v_total_players) * 100 ELSE 0 END,
    'profit', v_total_bets - v_total_payout
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 4. TRIGGERS THIẾT LẬP
-- ================================================================

-- Trigger đánh dấu bets đã hoàn thành khi game round kết thúc
CREATE OR REPLACE FUNCTION mark_bets_on_game_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ xử lý khi game thay đổi từ active sang completed
  IF OLD.status = 'active' AND NEW.status = 'completed' AND NEW.winning_number IS NOT NULL THEN
    -- Đánh dấu các bet thắng và thua
    UPDATE bets
    SET 
      is_winner = (selected_number = NEW.winning_number),
      updated_at = NOW()
    WHERE game_round_id = NEW.id AND is_winner IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger để tự động cập nhật số điểm kinh nghiệm khi user thắng
CREATE OR REPLACE FUNCTION update_experience_on_win()
RETURNS TRIGGER AS $$
DECLARE
  v_current_level INTEGER;
  v_next_level INTEGER;
  v_next_level_exp INTEGER;
  v_current_xp INTEGER;
  v_added_xp INTEGER;
  v_profile RECORD;
  v_benefits JSONB;
BEGIN
  -- Chỉ áp dụng cho bets mới được đánh dấu là thắng
  IF NEW.is_winner = TRUE AND (OLD.is_winner IS NULL OR OLD.is_winner = FALSE) THEN
    -- Lấy thông tin profile hiện tại
    SELECT * INTO v_profile
    FROM profiles
    WHERE id = NEW.user_id;
    
    -- Tính toán XP được thêm dựa trên số tiền đặt cược
    -- Công thức: 5 XP cho mỗi 10K đặt cược + 10 XP cho mỗi lần thắng
    v_added_xp := 10 + FLOOR(NEW.amount / 10000) * 5;
    
    -- Cập nhật điểm kinh nghiệm
    UPDATE profiles 
    SET experience_points = experience_points + v_added_xp,
        updated_at = NOW()
    WHERE id = NEW.user_id
    RETURNING level, experience_points INTO v_current_level, v_current_xp;
    
    -- Kiểm tra level tiếp theo
    SELECT level, experience_required INTO v_next_level, v_next_level_exp
    FROM user_levels
    WHERE level = v_current_level + 1;
    
    -- Nếu có level tiếp theo và đã đạt đủ XP
    IF v_next_level IS NOT NULL AND v_current_xp >= v_next_level_exp THEN
      -- Lấy benefits của level mới
      SELECT benefits INTO v_benefits
      FROM user_levels
      WHERE level = v_next_level;
      
      -- Cập nhật level
      UPDATE profiles
      SET level = v_next_level,
          updated_at = NOW()
      WHERE id = NEW.user_id;
      
      -- Thêm thông báo lên cấp
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      ) VALUES (
        NEW.user_id,
        'Chúc mừng! Bạn đã lên cấp',
        'Bạn đã đạt cấp độ ' || v_next_level || ' và nhận được những đặc quyền mới!',
        'system',
        false,
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger để tự động thêm thông báo khi có lượt chơi mới được tạo
CREATE OR REPLACE FUNCTION notify_on_new_game()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ áp dụng khi một game mới được kích hoạt (chuyển từ pending sang active)
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    -- Thêm thông báo vào bảng notifications
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_resource_id,
      related_resource_type,
      is_read,
      created_at
    )
    SELECT 
      p.id,
      'Lượt chơi mới đã mở',
      'Một lượt chơi mới đã được bắt đầu. Hãy tham gia ngay!',
      'game',
      NEW.id,
      'game_round',
      false,
      NOW()
    FROM profiles p
    WHERE p.is_active = TRUE
    AND p.last_login >= (NOW() - INTERVAL '7 days');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger khi có bet mới để cập nhật thống kê
CREATE OR REPLACE FUNCTION update_game_stats_on_new_bet()
RETURNS TRIGGER AS $$
BEGIN
  -- Cập nhật total_bets cho game round
  UPDATE game_rounds
  SET 
    total_bets = COALESCE(total_bets, 0) + NEW.amount,
    updated_at = NOW()
  WHERE id = NEW.game_round_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 5. ĐĂNG KÝ TRIGGERS
-- ================================================================

-- Tạo trigger cho user mới
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Trigger khi profile được cập nhật (avatar)
CREATE TRIGGER on_avatar_update
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
EXECUTE FUNCTION delete_old_avatar();

-- Trigger khi có bet mới hoặc bet được cập nhật
CREATE TRIGGER on_bet_update
AFTER INSERT OR UPDATE OF is_winner ON bets
FOR EACH ROW
EXECUTE FUNCTION update_user_statistics();

-- Trigger cho game khi hoàn thành
CREATE TRIGGER on_game_completion
AFTER UPDATE OF status ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION update_statistics_on_game_completion();

-- Trigger cho các functions kết quả game mới
CREATE TRIGGER on_game_completion
AFTER UPDATE OF status ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION mark_bets_on_game_completion();

CREATE TRIGGER on_bet_win
AFTER UPDATE OF is_winner ON bets
FOR EACH ROW
EXECUTE FUNCTION update_experience_on_win();

CREATE TRIGGER on_game_activation
AFTER UPDATE OF status ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION notify_on_new_game();

CREATE TRIGGER on_new_bet
AFTER INSERT ON bets
FOR EACH ROW
EXECUTE FUNCTION update_game_stats_on_new_bet();

-- ========================================
-- Phần mới: Thông báo khi game kết thúc và tính lợi nhuận game
-- ========================================

-- Function để lấy thống kê game
CREATE OR REPLACE FUNCTION get_game_stats(p_game_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_players INTEGER;
  v_total_winners INTEGER;
  v_total_bets NUMERIC;
  v_total_payout NUMERIC;
  v_game_status TEXT;
  v_winning_number TEXT;
BEGIN
  -- Lấy thông tin game
  SELECT status, winning_number, COALESCE(total_bets, 0), COALESCE(total_payout, 0)
  INTO v_game_status, v_winning_number, v_total_bets, v_total_payout
  FROM game_rounds
  WHERE id = p_game_id;
  
  IF v_game_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Game round not found');
  END IF;
  
  -- Đếm số người chơi
  SELECT COUNT(DISTINCT user_id)
  INTO v_total_players
  FROM bets
  WHERE game_round_id = p_game_id;
  
  -- Đếm số người thắng
  IF v_game_status = 'completed' AND v_winning_number IS NOT NULL THEN
    SELECT COUNT(DISTINCT user_id)
    INTO v_total_winners
    FROM bets
    WHERE game_round_id = p_game_id AND selected_number = v_winning_number;
  ELSE
    v_total_winners := 0;
  END IF;
  
  RETURN jsonb_build_object(
    'totalPlayers', v_total_players,
    'totalWinners', v_total_winners,
    'totalBets', v_total_bets,
    'totalPayout', v_total_payout,
    'gameStatus', v_game_status,
    'winningNumber', v_winning_number
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để tạo thông báo khi game kết thúc
CREATE OR REPLACE FUNCTION notify_users_on_game_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ thực hiện khi game thay đổi từ active sang completed
  IF OLD.status = 'active' AND NEW.status = 'completed' THEN
    -- Thông báo cho tất cả người tham gia
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_resource_id,
      related_resource_type,
      is_read,
      created_at
    )
    SELECT DISTINCT
      b.user_id,
      'Kết quả lượt chơi đã có',
      'Lượt chơi đã kết thúc với số trúng thưởng: ' || NEW.winning_number,
      'game',
      NEW.id,
      'game_round',
      false,
      NOW()
    FROM bets b
    WHERE b.game_round_id = NEW.id;
    
    -- Thông báo đặc biệt cho người thắng
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_resource_id,
      related_resource_type,
      is_read,
      created_at
    )
    SELECT DISTINCT
      b.user_id,
      'Chúc mừng! Bạn đã thắng!',
      'Bạn đã thắng với số ' || NEW.winning_number || '. Vào xem chi tiết ngay!',
      'reward',
      NEW.id,
      'game_round',
      false,
      NOW()
    FROM bets b
    WHERE b.game_round_id = NEW.id AND b.selected_number = NEW.winning_number;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho thông báo khi game kết thúc nếu chưa có
DROP TRIGGER IF EXISTS on_game_completion_notify ON game_rounds;
CREATE TRIGGER on_game_completion_notify
AFTER UPDATE OF status ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION notify_users_on_game_completion();

-- Function để tính lợi nhuận của game
CREATE OR REPLACE FUNCTION calculate_game_profit(game_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_bets NUMERIC;
  v_total_payout NUMERIC;
BEGIN
  SELECT COALESCE(total_bets, 0), COALESCE(total_payout, 0)
  INTO v_total_bets, v_total_payout
  FROM game_rounds
  WHERE id = game_id;
  
  RETURN v_total_bets - v_total_payout;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- Function để cập nhật kinh nghiệm và cấp độ người dùng khi thắng lớn
CREATE OR REPLACE FUNCTION update_user_level_on_big_win()
RETURNS TRIGGER AS $$
DECLARE
  v_current_level INTEGER;
  v_next_level_req INTEGER;
  v_bonus_xp INTEGER;
BEGIN
  -- Chỉ áp dụng khi reward lớn (> 1,000,000 VND)
  IF NEW.amount >= 1000000 THEN
    -- Tính điểm kinh nghiệm bonus dựa trên số tiền thắng
    v_bonus_xp := FLOOR(NEW.amount / 100000); -- 1 XP cho mỗi 100K thắng được
    
    -- Cập nhật điểm kinh nghiệm
    UPDATE profiles
    SET 
      experience_points = experience_points + v_bonus_xp,
      updated_at = NOW()
    WHERE id = NEW.user_id
    RETURNING level INTO v_current_level;
    
    -- Kiểm tra có thể lên cấp hay không
    SELECT experience_required INTO v_next_level_req
    FROM user_levels
    WHERE level = v_current_level + 1;
    
    IF v_next_level_req IS NOT NULL THEN
      -- Kiểm tra và cập nhật level nếu đủ điều kiện
      UPDATE profiles p
      SET 
        level = v_current_level + 1,
        updated_at = NOW()
      FROM (
        SELECT experience_points FROM profiles WHERE id = NEW.user_id
      ) AS user_exp
      WHERE p.id = NEW.user_id AND user_exp.experience_points >= v_next_level_req;
      
      -- Thêm thông báo lên cấp nếu đủ điều kiện
      IF FOUND THEN
        INSERT INTO notifications (
          user_id,
          title,
          message,
          type,
          is_read,
          created_at
        ) VALUES (
          NEW.user_id,
          'Chúc mừng! Bạn đã lên cấp',
          'Bạn đã đạt cấp độ ' || (v_current_level + 1) || ' nhờ thành tích thắng lớn!',
          'system',
          false,
          NOW()
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Đăng ký trigger
DROP TRIGGER IF EXISTS on_big_win_level_up ON reward_codes;
CREATE TRIGGER on_big_win_level_up
AFTER INSERT ON reward_codes
FOR EACH ROW
EXECUTE FUNCTION update_user_level_on_big_win();

-- ================================================================
-- Function để lấy phân phối số lượng đặt cược
CREATE OR REPLACE FUNCTION get_number_distribution(p_game_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  WITH number_stats AS (
    SELECT 
      selected_number,
      COUNT(*) AS bet_count,
      SUM(amount) AS total_amount,
      COUNT(DISTINCT user_id) AS unique_users
    FROM bets
    WHERE game_round_id = p_game_id
    GROUP BY selected_number
    ORDER BY bet_count DESC
  )
  SELECT json_object_agg(
    selected_number, 
    json_build_object(
      'count', bet_count,
      'totalAmount', total_amount,
      'uniqueUsers', unique_users
    )
  )
  INTO v_result
  FROM number_stats;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- Functions bổ sung cho Reward Management System

-- Kiểm tra trạng thái hết hạn của reward
CREATE OR REPLACE FUNCTION is_reward_expired(reward_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Lấy ngày hết hạn từ reward_code
  SELECT expiry_date INTO v_expiry_date 
  FROM reward_codes
  WHERE code = reward_code;
  
  -- Nếu không tìm thấy, coi như hết hạn
  IF v_expiry_date IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- So sánh với ngày hiện tại
  RETURN NOW() > v_expiry_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function tạo mã QR cho reward code
-- Lưu ý: Chỉ trả về dữ liệu để tạo QR, không tạo QR trực tiếp (việc này sẽ làm ở frontend)
CREATE OR REPLACE FUNCTION generate_reward_qr_data(reward_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_reward RECORD;
BEGIN
  -- Lấy thông tin từ reward_code
  SELECT id, code, amount, expiry_date, user_id, game_round_id
  INTO v_reward 
  FROM reward_codes
  WHERE code = reward_code;
  
  -- Nếu không tìm thấy, return error
  IF v_reward IS NULL THEN
    RETURN jsonb_build_object('error', 'Reward code not found');
  END IF;
  
  -- Tạo dữ liệu cho QR code
  RETURN jsonb_build_object(
    'code', v_reward.code,
    'amount', v_reward.amount,
    'expiry_date', v_reward.expiry_date,
    'id', v_reward.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function lấy thống kê rewards của user
CREATE OR REPLACE FUNCTION get_user_reward_statistics(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_rewards INTEGER;
  v_redeemed_count INTEGER;
  v_pending_count INTEGER;
  v_expired_count INTEGER;
  v_total_amount NUMERIC;
BEGIN
  -- Tổng số rewards
  SELECT COUNT(*) INTO v_total_rewards
  FROM reward_codes
  WHERE user_id = p_user_id;
  
  -- Đã đổi thưởng
  SELECT COUNT(*) INTO v_redeemed_count
  FROM reward_codes
  WHERE user_id = p_user_id AND is_used = TRUE;
  
  -- Còn khả dụng (chưa đổi và chưa hết hạn)
  SELECT COUNT(*) INTO v_pending_count
  FROM reward_codes
  WHERE user_id = p_user_id AND is_used = FALSE AND expiry_date > NOW();
  
  -- Đã hết hạn
  SELECT COUNT(*) INTO v_expired_count
  FROM reward_codes
  WHERE user_id = p_user_id AND is_used = FALSE AND expiry_date <= NOW();
  
  -- Tổng giá trị
  SELECT COALESCE(SUM(amount), 0) INTO v_total_amount
  FROM reward_codes
  WHERE user_id = p_user_id;
  
  -- Trả về kết quả
  RETURN jsonb_build_object(
    'totalRewards', v_total_rewards,
    'redeemedCount', v_redeemed_count,
    'pendingCount', v_pending_count,
    'expiredCount', v_expired_count,
    'totalAmount', v_total_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function tạo reward từ game
CREATE OR REPLACE FUNCTION create_game_reward(
  p_user_id UUID,
  p_game_id UUID,
  p_amount NUMERIC,
  p_expiry_days INTEGER DEFAULT 7
)
RETURNS TEXT AS $$
DECLARE
  v_reward_code TEXT;
BEGIN
  -- Tạo mã reward ngẫu nhiên
  v_reward_code := UPPER(
    SUBSTRING(MD5(p_user_id::TEXT || p_game_id::TEXT || NOW()::TEXT) FROM 1 FOR 8)
  );
  
  -- Chèn vào bảng reward_codes
  INSERT INTO reward_codes (
    code,
    user_id,
    game_round_id,
    amount,
    is_used,
    expiry_date,
    created_at,
    updated_at
  ) VALUES (
    v_reward_code,
    p_user_id,
    p_game_id,
    p_amount,
    FALSE,
    NOW() + (p_expiry_days || ' days')::INTERVAL,
    NOW(),
    NOW()
  );
  
  -- Tạo thông báo cho người dùng
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_resource_id,
    related_resource_type,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    'Phần thưởng mới!',
    'Bạn đã nhận được phần thưởng ' || p_amount || ' VND từ lượt chơi. Hãy đổi thưởng trước khi hết hạn!',
    'reward',
    p_game_id,
    'game_round',
    FALSE,
    NOW()
  );
  
  RETURN v_reward_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger để tự động cập nhật thời gian làm mới reward_codes
CREATE OR REPLACE FUNCTION update_reward_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER reward_timestamps_trigger
BEFORE UPDATE ON reward_codes
FOR EACH ROW
EXECUTE FUNCTION update_reward_timestamps();

-- Function gửi thông báo nhắc nhở rewards sắp hết hạn
CREATE OR REPLACE FUNCTION notify_expiring_rewards()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_reward RECORD;
BEGIN
  -- Tìm các rewards sắp hết hạn trong 24h và chưa được đổi
  FOR v_reward IN
    SELECT * FROM reward_codes
    WHERE is_used = FALSE
    AND expiry_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
  LOOP
    -- Thêm thông báo
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      related_resource_id,
      related_resource_type,
      is_read,
      created_at
    ) VALUES (
      v_reward.user_id,
      'Phần thưởng sắp hết hạn!',
      'Phần thưởng mã ' || v_reward.code || ' trị giá ' || v_reward.amount || ' VND sẽ hết hạn trong vòng 24 giờ tới. Hãy đổi thưởng ngay!',
      'reward',
      v_reward.id,
      'reward_code',
      FALSE,
      NOW()
    );
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- Cập nhật function để kiểm tra và cập nhật cấp độ người dùng
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
  next_level RECORD;
BEGIN
  -- Chỉ chạy khi experience_points bị thay đổi
  IF NEW.experience_points = OLD.experience_points THEN
    RETURN NEW;
  END IF;

  -- Tìm cấp độ phù hợp với điểm kinh nghiệm hiện tại
  SELECT * INTO next_level
  FROM user_levels
  WHERE experience_required <= NEW.experience_points
  ORDER BY level DESC
  LIMIT 1;

  -- Nếu tìm thấy cấp độ mới
  IF FOUND AND next_level.level > NEW.level THEN
    -- Cập nhật level
    NEW.level := next_level.level;
    
    -- Tạo thông báo lên cấp
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      is_read,
      created_at
    ) VALUES (
      NEW.id,
      'Chúc mừng! Bạn đã lên cấp',
      'Bạn đã đạt cấp độ ' || next_level.level || ': ' || next_level.name,
      'system',
      false,
      NOW()
    );
    
    -- Ghi log
    INSERT INTO system_logs (
      action_type,
      description,
      user_id,
      timestamp
    ) VALUES (
      'level_up',
      'User ' || NEW.id || ' leveled up to level ' || next_level.level,
      NEW.id,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho việc cập nhật level
DROP TRIGGER IF EXISTS on_experience_update ON profiles;
CREATE TRIGGER on_experience_update
BEFORE UPDATE OF experience_points ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_level();

-- Cải tiến function cập nhật thống kê người dùng để tính toán số may mắn
CREATE OR REPLACE FUNCTION update_lucky_number()
RETURNS TRIGGER AS $$
DECLARE
  lucky_numbers RECORD;
BEGIN
  -- Tìm số may mắn (số có tỷ lệ thắng cao nhất)
  WITH number_stats AS (
    SELECT 
      selected_number,
      COUNT(*) AS total_bets,
      SUM(CASE WHEN is_winner THEN 1 ELSE 0 END) AS wins,
      CASE 
        WHEN COUNT(*) > 0 THEN
          (SUM(CASE WHEN is_winner THEN 1 ELSE 0 END)::FLOAT / COUNT(*)::FLOAT) * 100
        ELSE 0
      END AS win_rate
    FROM bets
    WHERE user_id = NEW.user_id
    GROUP BY selected_number
    HAVING COUNT(*) >= 3 -- Ít nhất 3 lần đặt cược với số này
    ORDER BY win_rate DESC, wins DESC
    LIMIT 1
  )
  SELECT * INTO lucky_numbers FROM number_stats;

  -- Cập nhật số may mắn nếu tìm thấy
  IF FOUND THEN
    UPDATE user_statistics
    SET 
      lucky_number = lucky_numbers.selected_number,
      last_updated = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho việc cập nhật số may mắn
DROP TRIGGER IF EXISTS on_bet_update_lucky_number ON bets;
CREATE TRIGGER on_bet_update_lucky_number
AFTER INSERT OR UPDATE OF is_winner ON bets
FOR EACH ROW
EXECUTE FUNCTION update_lucky_number();

-- ================================================================
-- Function tính toán và áp dụng phúc lợi dựa trên cấp độ
CREATE OR REPLACE FUNCTION calculate_level_benefits(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user_level INTEGER;
  v_benefits JSONB;
BEGIN
  -- Lấy cấp độ hiện tại của người dùng
  SELECT level INTO v_user_level
  FROM profiles
  WHERE id = p_user_id;
  
  -- Lấy phúc lợi dựa trên cấp độ
  SELECT benefits INTO v_benefits
  FROM user_levels
  WHERE level = v_user_level;
  
  RETURN v_benefits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function lấy thống kê hoạt động của người dùng
CREATE OR REPLACE FUNCTION get_user_activity_stats(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  WITH recent_bets AS (
    SELECT 
      DATE_TRUNC('day', created_at) AS bet_date,
      COUNT(*) AS bet_count,
      SUM(CASE WHEN is_winner THEN 1 ELSE 0 END) AS wins,
      SUM(amount) AS total_amount
    FROM bets
    WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY bet_date
  ),
  daily_stats AS (
    SELECT 
      bet_date,
      bet_count,
      wins,
      total_amount,
      CASE WHEN bet_count > 0 THEN 
        ROUND((wins::NUMERIC / bet_count::NUMERIC) * 100, 2)
      ELSE 0 END AS win_rate
    FROM recent_bets
  )
  SELECT 
    jsonb_build_object(
      'dailyActivity', jsonb_agg(
        jsonb_build_object(
          'date', bet_date,
          'bets', bet_count,
          'wins', wins,
          'amount', total_amount,
          'winRate', win_rate
        )
      ),
      'summary', jsonb_build_object(
        'totalBets', COALESCE(SUM(bet_count), 0),
        'totalWins', COALESCE(SUM(wins), 0),
        'totalAmount', COALESCE(SUM(total_amount), 0),
        'averageWinRate', CASE 
          WHEN SUM(bet_count) > 0 THEN 
            ROUND((SUM(wins)::NUMERIC / SUM(bet_count)::NUMERIC) * 100, 2)
          ELSE 0 
        END
      )
    ) INTO v_result
  FROM daily_stats;
  
  -- Xử lý trường hợp không có dữ liệu
  IF v_result IS NULL THEN
    v_result := jsonb_build_object(
      'dailyActivity', '[]'::JSONB,
      'summary', jsonb_build_object(
        'totalBets', 0,
        'totalWins', 0,
        'totalAmount', 0,
        'averageWinRate', 0
      )
    );
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- END OF FILE
-- ================================================================