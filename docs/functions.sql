-- ================================================================
-- File: game_betting_system_complete.sql
-- Mục đích: Cung cấp tất cả functions và triggers cần thiết cho hệ thống Game Cá Cược
-- ================================================================

-- ------------------------------------------------
-- 0. Database Setup - Cài đặt ban đầu
-- ------------------------------------------------

-- Vô hiệu hóa tất cả triggers hiện có để tránh xung đột
DO $$ 
DECLARE
  trigger_rec RECORD;
BEGIN
  FOR trigger_rec IN 
    SELECT tgname, relname 
    FROM pg_trigger 
    JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
    WHERE NOT tgisinternal AND relnamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('ALTER TABLE %I DISABLE TRIGGER %I', 
      trigger_rec.relname, trigger_rec.tgname);
  END LOOP;
END $$;

-- Đặt lại các sequence nếu cần
-- ALTER SEQUENCE user_levels_id_seq RESTART WITH 1;

-- ------------------------------------------------
-- 1. Xử lý người dùng - User Management
-- ------------------------------------------------

-- Function xử lý user mới - ĐƠN GIẢN HÓA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Tạo bản ghi cơ bản trong profiles với email
  INSERT INTO public.profiles (
    id, 
    email,        -- Thêm trường email từ auth.users
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
    NEW.email,    -- Gán email từ auth.users
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
  
  -- Ghi log nếu cần
  INSERT INTO system_logs (action_type, description, user_id, timestamp)
  VALUES ('user_created', 'New user account created with email: ' || NEW.email, NEW.id, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho user mới
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function và trigger tạo mã giới thiệu
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT := '';
  i INTEGER;
  max_attempts INTEGER := 10; -- Giới hạn số lần thử
  attempts INTEGER := 0;
  len INTEGER;
BEGIN
  -- Chỉ tạo mã nếu chưa có
  IF NEW.referral_code IS NOT NULL THEN
    RETURN NEW;
  END IF;

  len := length(chars);
  -- Tạo mã giới thiệu ngẫu nhiên 6 ký tự
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, (floor(random() * len) + 1)::integer, 1);
    END LOOP;
    
    -- Kiểm tra tính duy nhất
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = code) THEN
      NEW.referral_code := code;
      RETURN NEW;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      -- Nếu đã thử nhiều lần không thành công, tạo mã dài hơn để tránh xung đột
      code := UPPER(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
      NEW.referral_code := code;
      RETURN NEW;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger cho mã giới thiệu
DROP TRIGGER IF EXISTS before_profile_insert ON profiles;
CREATE TRIGGER before_profile_insert
BEFORE INSERT ON profiles
FOR EACH ROW
WHEN (NEW.referral_code IS NULL)
EXECUTE FUNCTION generate_referral_code();

-- Function và trigger tạo thống kê người dùng
CREATE OR REPLACE FUNCTION initialize_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ tạo nếu chưa tồn tại
  IF NOT EXISTS (SELECT 1 FROM user_statistics WHERE user_id = NEW.id) THEN
    BEGIN
      INSERT INTO user_statistics (
        user_id, 
        total_games_played, 
        games_won, 
        win_rate, 
        biggest_win, 
        lucky_number, 
        total_rewards, 
        last_updated
      ) VALUES (
        NEW.id, 
        0, 
        0, 
        0, 
        0, 
        NULL, 
        0, 
        NOW()
      );
      EXCEPTION WHEN OTHERS THEN
        -- Log lỗi nhưng không dừng transaction
        RAISE WARNING 'Error initializing user statistics: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho thống kê người dùng
DROP TRIGGER IF EXISTS after_user_created ON profiles;
CREATE TRIGGER after_user_created
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION initialize_user_statistics();

-- ------------------------------------------------
-- 2. Quản lý số dư người dùng - Balance Management
-- ------------------------------------------------

-- Function cập nhật số dư
CREATE OR REPLACE FUNCTION update_user_balance(
  user_id UUID,
  amount NUMERIC,
  is_increase BOOLEAN
) RETURNS BOOLEAN AS $$
DECLARE
  current_balance NUMERIC;
  new_balance NUMERIC;
BEGIN
  -- Lấy số dư hiện tại
  SELECT balance INTO current_balance FROM profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE WARNING 'User % not found', user_id;
    RETURN FALSE;
  END IF;
  
  -- Tính toán số dư mới
  IF is_increase THEN
    new_balance := current_balance + amount;
  ELSE
    -- Kiểm tra số dư trước khi trừ tiền
    IF current_balance < amount THEN
      RAISE WARNING 'Insufficient balance for user %: % < %', user_id, current_balance, amount;
      RETURN FALSE;
    END IF;
    new_balance := current_balance - amount;
  END IF;
  
  -- Cập nhật số dư
  UPDATE profiles 
  SET balance = new_balance,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Ghi log giao dịch
  INSERT INTO system_logs (
    action_type, 
    description, 
    user_id,
    timestamp
  ) VALUES (
    CASE WHEN is_increase THEN 'balance_increase' ELSE 'balance_decrease' END,
    CASE WHEN is_increase 
      THEN 'Balance increased by ' || amount 
      ELSE 'Balance decreased by ' || amount 
    END,
    user_id,
    NOW()
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 3. Hệ thống game và đặt cược - Gaming System
-- ------------------------------------------------

-- Function cập nhật tổng tiền cược cho game round
CREATE OR REPLACE FUNCTION update_game_total_bets()
RETURNS TRIGGER AS $$
BEGIN
  -- Cập nhật tổng tiền đặt cược cho game round
  UPDATE game_rounds
  SET total_bets = COALESCE(total_bets, 0) + NEW.amount
  WHERE id = NEW.game_round_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cho tổng tiền cược
DROP TRIGGER IF EXISTS after_bet_placed_update_total ON bets;
CREATE TRIGGER after_bet_placed_update_total
AFTER INSERT ON bets
FOR EACH ROW
EXECUTE FUNCTION update_game_total_bets();

-- Function xử lý kết quả game
CREATE OR REPLACE FUNCTION process_game_results(
  game_id UUID,
  winning_number TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  reward_amount NUMERIC;
  winner_bet RECORD;
  reward_code TEXT;
  total_payout NUMERIC := 0;
  game_exists BOOLEAN;
BEGIN
  -- Kiểm tra game tồn tại
  SELECT EXISTS(SELECT 1 FROM game_rounds WHERE id = game_id) INTO game_exists;
  IF NOT game_exists THEN
    RAISE WARNING 'Game % not found', game_id;
    RETURN FALSE;
  END IF;

  -- Kiểm tra game chưa hoàn thành
  IF EXISTS(SELECT 1 FROM game_rounds WHERE id = game_id AND status = 'completed') THEN
    RAISE WARNING 'Game % already completed', game_id;
    RETURN FALSE;
  END IF;

  -- Cập nhật game với số trúng thưởng
  UPDATE game_rounds 
  SET status = 'completed',
      winning_number = winning_number,
      end_time = NOW()
  WHERE id = game_id;
  
  -- Cập nhật trạng thái tất cả các bets
  UPDATE bets 
  SET is_winner = (selected_number = winning_number)
  WHERE game_round_id = game_id;
  
  -- Xử lý phần thưởng cho người chiến thắng
  FOR winner_bet IN 
    SELECT * FROM bets 
    WHERE game_round_id = game_id AND selected_number = winning_number
  LOOP
    BEGIN
      -- Tính toán phần thưởng (gấp đôi số tiền đặt cược)
      reward_amount := winner_bet.amount * 2;
      total_payout := total_payout + reward_amount;
      
      -- Tạo mã code phần thưởng với định dạng "WIN-XXXX-XXXX-XXXX"
      reward_code := 'WIN-' || 
                     UPPER(substring(md5(random()::text || now()::text) from 1 for 4)) || '-' ||
                     UPPER(substring(md5(random()::text || now()::text) from 5 for 4)) || '-' ||
                     UPPER(substring(md5(random()::text || now()::text) from 9 for 4));
      
      -- Lưu mã phần thưởng
      INSERT INTO reward_codes (
        code, user_id, game_round_id, amount, is_used, expiry_date
      ) VALUES (
        reward_code, winner_bet.user_id, game_id, reward_amount, FALSE, 
        NOW() + INTERVAL '24 hours'
      );
      
      -- Cập nhật thống kê người dùng
      UPDATE user_statistics
      SET games_won = COALESCE(games_won, 0) + 1,
          win_rate = (COALESCE(games_won, 0) + 1)::float / NULLIF(COALESCE(total_games_played, 0), 0) * 100,
          biggest_win = GREATEST(COALESCE(biggest_win, 0), reward_amount),
          total_rewards = COALESCE(total_rewards, 0) + reward_amount,
          last_updated = NOW()
      WHERE user_id = winner_bet.user_id;
      
      -- Tạo thông báo cho người thắng
      INSERT INTO notifications (
        user_id, title, message, type, related_resource_id, 
        related_resource_type, is_read, created_at
      ) VALUES (
        winner_bet.user_id,
        'Chúc mừng! Bạn đã thắng',
        'Số ' || winning_number || ' đã trúng. Bạn đã thắng ' || reward_amount || ' VND.',
        'game', game_id, 'game_rounds', FALSE, NOW()
      );
      
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error processing winner %: %', winner_bet.user_id, SQLERRM;
    END;
  END LOOP;
  
  -- Cập nhật tổng số tiền thưởng của game
  UPDATE game_rounds
  SET total_payout = total_payout
  WHERE id = game_id;
  
  -- Tạo thông báo cho tất cả người tham gia không thắng
  BEGIN
    INSERT INTO notifications (
      user_id, title, message, type, related_resource_id, 
      related_resource_type, is_read, created_at
    )
    SELECT 
      user_id,
      'Kết quả lượt chơi',
      'Lượt chơi đã kết thúc. Số trúng là: ' || winning_number,
      'game', game_id, 'game_rounds', FALSE, NOW()
    FROM bets
    WHERE game_round_id = game_id AND is_winner IS FALSE;
    
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error creating notifications: %', SQLERRM;
  END;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 4. Thống kê người dùng - User Statistics
-- ------------------------------------------------

-- Function và trigger cập nhật thống kê khi đặt cược
CREATE OR REPLACE FUNCTION update_user_game_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Cập nhật số lượt chơi trong thống kê
  UPDATE user_statistics
  SET total_games_played = COALESCE(total_games_played, 0) + 1,
      win_rate = CASE 
                  WHEN COALESCE(games_won, 0) > 0 
                  THEN COALESCE(games_won, 0)::float / (COALESCE(total_games_played, 0) + 1) * 100
                  ELSE 0 
                 END,
      last_updated = NOW()
  WHERE user_id = NEW.user_id;
  
  -- Cập nhật tổng số tiền đã cược
  UPDATE profiles
  SET total_wagered = COALESCE(total_wagered, 0) + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error updating user game stats: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger cập nhật thống kê
DROP TRIGGER IF EXISTS after_bet_placed ON bets;
CREATE TRIGGER after_bet_placed
AFTER INSERT ON bets
FOR EACH ROW
EXECUTE FUNCTION update_user_game_stats();

-- ------------------------------------------------
-- 5. Phần thưởng và đổi thưởng - Rewards
-- ------------------------------------------------

-- Function đổi thưởng từ mã code
CREATE OR REPLACE FUNCTION redeem_reward_code(
  code_text TEXT,
  redeeming_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  reward_record RECORD;
BEGIN
  -- Kiểm tra mã hợp lệ
  SELECT * INTO reward_record 
  FROM reward_codes 
  WHERE code = code_text 
    AND user_id = redeeming_user_id
    AND is_used = FALSE
    AND expiry_date > NOW();
  
  IF reward_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Cập nhật trạng thái đã sử dụng
  UPDATE reward_codes
  SET is_used = TRUE, redeemed_date = NOW()
  WHERE id = reward_record.id;
  
  -- Cộng tiền vào tài khoản
  IF NOT update_user_balance(redeeming_user_id, reward_record.amount, TRUE) THEN
    RAISE WARNING 'Failed to update balance for user %', redeeming_user_id;
    RETURN FALSE;
  END IF;
  
  -- Cập nhật tổng tiền thắng
  UPDATE profiles
  SET total_won = COALESCE(total_won, 0) + reward_record.amount,
      updated_at = NOW()
  WHERE id = redeeming_user_id;
  
  -- Tạo thông báo đổi thưởng
  INSERT INTO notifications (
    user_id, title, message, type, related_resource_id, 
    related_resource_type, is_read, created_at
  )
  VALUES (
    redeeming_user_id,
    'Đổi thưởng thành công',
    'Bạn đã đổi mã thưởng và nhận được ' || reward_record.amount || ' VND.',
    'reward', reward_record.id, 'reward_codes', FALSE, NOW()
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error redeeming reward: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 6. Kinh nghiệm và cấp độ - Experience & Levels
-- ------------------------------------------------

-- Function cập nhật điểm kinh nghiệm và xử lý thăng cấp
CREATE OR REPLACE FUNCTION update_user_experience(
  user_id UUID,
  points_to_add INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_level INTEGER;
  next_level_record RECORD;
BEGIN
  -- Lấy cấp độ hiện tại
  SELECT level INTO current_level FROM profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE WARNING 'User % not found', user_id;
    RETURN FALSE;
  END IF;
  
  -- Thêm điểm kinh nghiệm
  UPDATE profiles
  SET experience_points = COALESCE(experience_points, 0) + points_to_add,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Kiểm tra điều kiện thăng cấp
  SELECT * INTO next_level_record 
  FROM user_levels 
  WHERE level = current_level + 1
    AND experience_required <= (SELECT experience_points FROM profiles WHERE id = user_id);
  
  -- Nếu đủ điều kiện thăng cấp
  IF next_level_record IS NOT NULL THEN
    -- Cập nhật cấp độ
    UPDATE profiles
    SET level = next_level_record.level,
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Tạo thông báo thăng cấp
    INSERT INTO notifications (
      user_id, title, message, type, is_read, created_at
    )
    VALUES (
      user_id,
      'Chúc mừng thăng cấp!',
      'Bạn đã đạt cấp ' || next_level_record.level || ': ' || next_level_record.name,
      'system', FALSE, NOW()
    );
  END IF;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error updating user experience: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function và trigger thêm kinh nghiệm khi thắng game
CREATE OR REPLACE FUNCTION add_experience_on_win()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_winner = TRUE AND (OLD.is_winner IS NULL OR OLD.is_winner = FALSE) THEN
    -- Thêm điểm kinh nghiệm (10 điểm cho mỗi chiến thắng)
    PERFORM update_user_experience(NEW.user_id, 10);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error adding experience on win: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger thêm kinh nghiệm khi thắng
DROP TRIGGER IF EXISTS after_bet_win ON bets;
CREATE TRIGGER after_bet_win
AFTER UPDATE ON bets
FOR EACH ROW
WHEN (NEW.is_winner IS DISTINCT FROM OLD.is_winner)
EXECUTE FUNCTION add_experience_on_win();

-- ------------------------------------------------
-- 7. Xử lý yêu cầu thanh toán - Payment Requests
-- ------------------------------------------------

-- Function xử lý phê duyệt/từ chối thanh toán
CREATE OR REPLACE FUNCTION process_payment_request(
  request_id UUID,
  admin_id UUID,
  new_status TEXT,
  admin_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  request_record RECORD;
BEGIN
  -- Kiểm tra yêu cầu tồn tại
  SELECT * INTO request_record
  FROM payment_requests
  WHERE id = request_id AND status = 'pending';
  
  IF request_record IS NULL THEN
    RAISE WARNING 'Payment request % not found or not pending', request_id;
    RETURN FALSE;
  END IF;
  
  -- Cập nhật trạng thái yêu cầu
  UPDATE payment_requests
  SET status = new_status,
      processed_by = admin_id,
      processed_date = NOW(),
      notes = COALESCE(admin_notes, notes)
  WHERE id = request_id;
  
  -- Nếu phê duyệt, cộng tiền vào tài khoản
  IF new_status = 'approved' THEN
    IF NOT update_user_balance(request_record.user_id, request_record.amount, TRUE) THEN
      RAISE WARNING 'Failed to update balance for payment request %', request_id;
      -- Không phải rollback, cứ tiếp tục để admin có thể sửa lại sau
    END IF;
    
    -- Tạo thông báo phê duyệt
    INSERT INTO notifications (
      user_id, title, message, type, related_resource_id, 
      related_resource_type, is_read, created_at
    )
    VALUES (
      request_record.user_id,
      'Yêu cầu nạp tiền đã được duyệt',
      'Yêu cầu nạp ' || request_record.amount || ' VND của bạn đã được phê duyệt.',
      'payment', request_id, 'payment_requests', FALSE, NOW()
    );
  ELSE
    -- Tạo thông báo từ chối
    INSERT INTO notifications (
      user_id, title, message, type, related_resource_id, 
      related_resource_type, is_read, created_at
    )
    VALUES (
      request_record.user_id,
      'Yêu cầu nạp tiền bị từ chối',
      'Yêu cầu nạp ' || request_record.amount || ' VND của bạn đã bị từ chối.' || 
      CASE WHEN admin_notes IS NOT NULL THEN ' Lý do: ' || admin_notes ELSE '' END,
      'payment', request_id, 'payment_requests', FALSE, NOW()
    );
  END IF;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error processing payment request: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 8. Hệ thống giới thiệu - Referral System
-- ------------------------------------------------

-- Function xử lý áp dụng mã giới thiệu
CREATE OR REPLACE FUNCTION apply_referral_code(
  user_id UUID,
  code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  referrer_id UUID;
BEGIN
  -- Tìm người giới thiệu từ mã
  SELECT id INTO referrer_id FROM profiles WHERE referral_code = code AND id <> user_id;
  
  IF referrer_id IS NULL THEN
    RAISE WARNING 'Invalid referral code % or self-referral attempt by %', code, user_id;
    RETURN FALSE;
  END IF;
  
  -- Kiểm tra xem người dùng đã có người giới thiệu chưa
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND referred_by IS NOT NULL) THEN
    RAISE WARNING 'User % already has a referrer', user_id;
    RETURN FALSE;
  END IF;
  
  -- Cập nhật trường referred_by
  UPDATE profiles
  SET referred_by = referrer_id, updated_at = NOW()
  WHERE id = user_id;
  
  -- Tạo bản ghi giới thiệu
  INSERT INTO referrals (
    referrer_id, referred_id, status, created_at
  )
  VALUES (
    referrer_id, user_id, 'pending', NOW()
  );
  
  -- Thông báo cho người giới thiệu
  INSERT INTO notifications (
    user_id, title, message, type, is_read, created_at
  )
  VALUES (
    referrer_id,
    'Giới thiệu mới',
    'Một người dùng mới đã sử dụng mã giới thiệu của bạn.',
    'system', FALSE, NOW()
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error applying referral code: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function hoàn thành quá trình giới thiệu và thưởng
CREATE OR REPLACE FUNCTION complete_referral(
  referral_id UUID,
  reward_amount NUMERIC DEFAULT 50000
) RETURNS BOOLEAN AS $$
DECLARE
  ref_record RECORD;
BEGIN
  -- Lấy thông tin giới thiệu
  SELECT * INTO ref_record 
  FROM referrals 
  WHERE id = referral_id AND status = 'pending';
  
  IF ref_record IS NULL THEN
    RAISE WARNING 'Referral % not found or not pending', referral_id;
    RETURN FALSE;
  END IF;
  
  -- Cập nhật trạng thái giới thiệu
  UPDATE referrals
  SET status = 'completed',
      completed_at = NOW(),
      reward_amount = reward_amount,
      reward_paid = TRUE
  WHERE id = referral_id;
  
  -- Cộng tiền thưởng cho người giới thiệu
  IF NOT update_user_balance(ref_record.referrer_id, reward_amount, TRUE) THEN
    RAISE WARNING 'Failed to update balance for referrer %', ref_record.referrer_id;
    RETURN FALSE;
  END IF;
  
  -- Thông báo cho người giới thiệu
  INSERT INTO notifications (
    user_id, title, message, type, related_resource_id, 
    related_resource_type, is_read, created_at
  )
  VALUES (
    ref_record.referrer_id,
    'Thưởng giới thiệu',
    'Bạn đã nhận được ' || reward_amount || ' VND từ việc giới thiệu thành công.',
    'reward', referral_id, 'referrals', FALSE, NOW()
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error completing referral: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 9. Khuyến mãi - Promotions
-- ------------------------------------------------

-- Function áp dụng khuyến mãi
CREATE OR REPLACE FUNCTION apply_promotion(
  user_id UUID,
  promotion_id UUID,
  game_round_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  promotion_record RECORD;
  user_level INTEGER;
BEGIN
  -- Kiểm tra khuyến mãi có tồn tại và còn hiệu lực
  SELECT * INTO promotion_record FROM promotions 
  WHERE id = promotion_id 
    AND is_active = TRUE
    AND starts_at <= NOW()
    AND ends_at >= NOW();
  
  IF promotion_record IS NULL THEN
    RAISE WARNING 'Promotion % not found or not active', promotion_id;
    RETURN FALSE;
  END IF;
  
  -- Kiểm tra người dùng đã sử dụng khuyến mãi này chưa
  IF EXISTS (
    SELECT 1 FROM promotion_usages 
    WHERE user_id = user_id AND promotion_id = promotion_id
  ) THEN
    RAISE WARNING 'User % has already used promotion %', user_id, promotion_id;
    RETURN FALSE;
  END IF;
  
  -- Kiểm tra số lượt sử dụng tối đa
  IF promotion_record.max_usage_count IS NOT NULL 
     AND promotion_record.current_usage_count >= promotion_record.max_usage_count THEN
    RAISE WARNING 'Promotion % has reached maximum usage count', promotion_id;
    RETURN FALSE;
  END IF;
  
  -- Lấy cấp độ người dùng hiện tại
  SELECT level INTO user_level FROM profiles WHERE id = user_id;
  
  -- Kiểm tra yêu cầu cấp độ
  IF user_level < promotion_record.min_level THEN
    RAISE WARNING 'User % level (%) is below promotion % requirement (%)', 
                  user_id, user_level, promotion_id, promotion_record.min_level;
    RETURN FALSE;
  END IF;
  
  -- Ghi nhận sử dụng khuyến mãi
  INSERT INTO promotion_usages (
    user_id, promotion_id, game_round_id, used_at
  )
  VALUES (
    user_id, promotion_id, game_round_id, NOW()
  );
  
  -- Tăng số lượt sử dụng của khuyến mãi
  UPDATE promotions
  SET current_usage_count = COALESCE(current_usage_count, 0) + 1
  WHERE id = promotion_id;
  
  -- Tạo thông báo áp dụng khuyến mãi
  INSERT INTO notifications (
    user_id, title, message, type, related_resource_id, 
    related_resource_type, is_read, created_at
  )
  VALUES (
    user_id,
    'Khuyến mãi đã áp dụng',
    'Bạn đã áp dụng thành công khuyến mãi: ' || promotion_record.title,
    'promotion', promotion_id, 'promotions', FALSE, NOW()
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error applying promotion: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 10. Utilities và tiện ích - Utilities
-- ------------------------------------------------

-- Function tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo triggers cập nhật timestamp
DROP TRIGGER IF EXISTS set_timestamp_profiles ON profiles;
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_game_rounds ON game_rounds;
CREATE TRIGGER set_timestamp_game_rounds
BEFORE UPDATE ON game_rounds
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_bets ON bets;
CREATE TRIGGER set_timestamp_bets
BEFORE UPDATE ON bets
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_promotions ON promotions;
CREATE TRIGGER set_timestamp_promotions
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Function ghi log hệ thống
CREATE OR REPLACE FUNCTION log_system_action(
  action_type TEXT,
  description TEXT,
  user_id UUID,
  ip_address TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO system_logs (
    action_type, description, user_id, ip_address, timestamp
  )
  VALUES (
    action_type, description, user_id, ip_address, NOW()
  );
EXCEPTION WHEN OTHERS THEN
  -- Không hiển thị lỗi khi ghi log
  RAISE NOTICE 'Failed to log system action: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------
-- 11. Bật lại các triggers
-- ------------------------------------------------

-- Bật lại tất cả triggers
DO $$ 
DECLARE
  trigger_rec RECORD;
BEGIN
  FOR trigger_rec IN 
    SELECT tgname, relname 
    FROM pg_trigger 
    JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
    WHERE NOT tgisinternal AND relnamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE TRIGGER %I', 
      trigger_rec.relname, trigger_rec.tgname);
  END LOOP;
END $$;

-- Đảm bảo trigger auth.users luôn bật
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- ================================================================
-- KẾT THÚC FILE SQL
-- ================================================================