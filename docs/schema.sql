-- ================================================================
-- File: recreate_all_tables.sql (Updated)
-- Mục đích: Tạo lại tất cả các bảng trong dự án Game Cá Cược với foreign keys rõ ràng
-- Lưu ý: SCRIPT NÀY SẼ XÓA TẤT CẢ DỮ LIỆU HIỆN CÓ!!!
-- ================================================================

-- Vô hiệu hóa tất cả triggers để tránh xung đột
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
    EXECUTE format('ALTER TABLE IF EXISTS %I DISABLE TRIGGER %I', 
      trigger_rec.relname, trigger_rec.tgname);
  END LOOP;
END $$;

-- Xóa các ràng buộc khóa ngoại để có thể xóa bảng
DO $$
DECLARE
  constraint_rec RECORD;
BEGIN
  FOR constraint_rec IN 
    SELECT tc.constraint_name, tc.table_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu 
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS %I DROP CONSTRAINT IF EXISTS %I CASCADE', 
      constraint_rec.table_name, constraint_rec.constraint_name);
  END LOOP;
END $$;

-- Xóa tất cả các bảng hiện có
DROP TABLE IF EXISTS promotion_usages CASCADE;
DROP TABLE IF EXISTS reward_codes CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS game_rounds CASCADE;
DROP TABLE IF EXISTS payment_requests CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS user_statistics CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS user_levels CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ------------------------------------------------
-- 1. Tạo bảng profiles - Thông tin người dùng
-- ------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  phone TEXT,
  telegram_id TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  balance NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  total_wagered NUMERIC NOT NULL DEFAULT 0,
  total_won NUMERIC NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID,
  preferences JSONB,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  telegram_notif_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho email và phone
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON profiles(phone);

-- Thêm ràng buộc sau khi tạo bảng để tránh circular reference
ALTER TABLE profiles 
  ADD CONSTRAINT fk_profiles_auth_users
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE profiles 
  ADD CONSTRAINT fk_profiles_referred_by
  FOREIGN KEY (referred_by) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;

-- ------------------------------------------------
-- 2. Tạo bảng user_levels - Cấp độ người dùng
-- ------------------------------------------------
CREATE TABLE user_levels (
  id SERIAL PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  experience_required INTEGER NOT NULL,
  benefits JSONB,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Thêm dữ liệu mẫu cho bảng user_levels
INSERT INTO user_levels (level, name, experience_required, benefits) VALUES
(1, 'Người mới', 0, '{"bonus_percent": 0}'),
(2, 'Người chơi', 100, '{"bonus_percent": 5}'),
(3, 'Cao thủ', 300, '{"bonus_percent": 10}'),
(4, 'Chuyên gia', 700, '{"bonus_percent": 15}'),
(5, 'Bậc thầy', 1500, '{"bonus_percent": 20}');

-- Liên kết profiles với user_levels
ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_user_levels
  FOREIGN KEY (level)
  REFERENCES user_levels(level)
  ON DELETE SET DEFAULT;

-- ------------------------------------------------
-- 3. Tạo bảng game_rounds - Lượt chơi
-- ------------------------------------------------
CREATE TABLE game_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  winning_number TEXT,
  total_bets NUMERIC DEFAULT 0,
  total_payout NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho status và ngày
CREATE INDEX IF NOT EXISTS game_rounds_status_idx ON game_rounds(status);
CREATE INDEX IF NOT EXISTS game_rounds_start_time_idx ON game_rounds(start_time);

-- Thêm foreign key
ALTER TABLE game_rounds
  ADD CONSTRAINT fk_game_rounds_profiles
  FOREIGN KEY (created_by)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- ------------------------------------------------
-- 4. Tạo bảng bets - Đặt cược
-- ------------------------------------------------
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  game_round_id UUID NOT NULL,
  selected_number TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  is_winner BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho user_id và game_round_id
CREATE INDEX IF NOT EXISTS bets_user_id_idx ON bets(user_id);
CREATE INDEX IF NOT EXISTS bets_game_round_id_idx ON bets(game_round_id);
CREATE INDEX IF NOT EXISTS bets_created_at_idx ON bets(created_at);

-- Thêm foreign keys
ALTER TABLE bets
  ADD CONSTRAINT fk_bets_profiles
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE bets
  ADD CONSTRAINT fk_bets_game_rounds
  FOREIGN KEY (game_round_id)
  REFERENCES game_rounds(id)
  ON DELETE CASCADE;

-- ------------------------------------------------
-- 5. Tạo bảng payment_requests - Yêu cầu thanh toán
-- ------------------------------------------------
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_image TEXT,
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  processed_date TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho user_id và status
CREATE INDEX IF NOT EXISTS payment_requests_user_id_idx ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS payment_requests_status_idx ON payment_requests(status);
CREATE INDEX IF NOT EXISTS payment_requests_request_date_idx ON payment_requests(request_date);

-- Thêm foreign keys
ALTER TABLE payment_requests
  ADD CONSTRAINT fk_payment_requests_profiles_user
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE payment_requests
  ADD CONSTRAINT fk_payment_requests_profiles_processor
  FOREIGN KEY (processed_by)
  REFERENCES profiles(id)
  ON DELETE SET NULL;

-- ------------------------------------------------
-- 6. Tạo bảng reward_codes - Mã phần thưởng
-- ------------------------------------------------
CREATE TABLE reward_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  game_round_id UUID NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  is_used BOOLEAN DEFAULT FALSE,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  redeemed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho code và user_id
CREATE INDEX IF NOT EXISTS reward_codes_code_idx ON reward_codes(code);
CREATE INDEX IF NOT EXISTS reward_codes_user_id_idx ON reward_codes(user_id);
CREATE INDEX IF NOT EXISTS reward_codes_expiry_date_idx ON reward_codes(expiry_date);

-- Thêm foreign keys
ALTER TABLE reward_codes
  ADD CONSTRAINT fk_reward_codes_profiles
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE reward_codes
  ADD CONSTRAINT fk_reward_codes_game_rounds
  FOREIGN KEY (game_round_id)
  REFERENCES game_rounds(id)
  ON DELETE CASCADE;

-- ------------------------------------------------
-- 7. Tạo bảng user_statistics - Thống kê người dùng
-- ------------------------------------------------
CREATE TABLE user_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  win_rate NUMERIC DEFAULT 0,
  biggest_win NUMERIC DEFAULT 0,
  lucky_number TEXT,
  total_rewards NUMERIC DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Thêm foreign key
ALTER TABLE user_statistics
  ADD CONSTRAINT fk_user_statistics_profiles
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- ------------------------------------------------
-- 8. Tạo bảng promotions - Khuyến mãi
-- ------------------------------------------------
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  reward_multiplier NUMERIC NOT NULL DEFAULT 1 CHECK (reward_multiplier > 0),
  min_level INTEGER NOT NULL DEFAULT 1,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  requirements JSONB,
  max_usage_count INTEGER,
  current_usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho ngày bắt đầu, kết thúc và trạng thái
CREATE INDEX IF NOT EXISTS promotions_date_range_idx ON promotions(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS promotions_is_active_idx ON promotions(is_active);

-- Thêm foreign key
ALTER TABLE promotions
  ADD CONSTRAINT fk_promotions_user_levels
  FOREIGN KEY (min_level)
  REFERENCES user_levels(level)
  ON DELETE SET DEFAULT;

-- ------------------------------------------------
-- 9. Tạo bảng promotion_usages - Sử dụng khuyến mãi
-- ------------------------------------------------
CREATE TABLE promotion_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  promotion_id UUID NOT NULL,
  game_round_id UUID,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, promotion_id)
);

-- Thêm foreign keys
ALTER TABLE promotion_usages
  ADD CONSTRAINT fk_promotion_usages_profiles
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE promotion_usages
  ADD CONSTRAINT fk_promotion_usages_promotions
  FOREIGN KEY (promotion_id)
  REFERENCES promotions(id)
  ON DELETE CASCADE;

ALTER TABLE promotion_usages
  ADD CONSTRAINT fk_promotion_usages_game_rounds
  FOREIGN KEY (game_round_id)
  REFERENCES game_rounds(id)
  ON DELETE SET NULL;

-- ------------------------------------------------
-- 10. Tạo bảng notifications - Thông báo
-- ------------------------------------------------
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'game', 'payment', 'reward', 'promotion')),
  related_resource_id UUID,
  related_resource_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Tạo index cho user_id và trạng thái đọc
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Thêm foreign key
ALTER TABLE notifications
  ADD CONSTRAINT fk_notifications_profiles
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- ------------------------------------------------
-- 11. Tạo bảng referrals - Giới thiệu người dùng
-- ------------------------------------------------
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  reward_amount NUMERIC,
  reward_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho referrer_id và referred_id
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_id_idx ON referrals(referred_id);

-- Thêm foreign keys
ALTER TABLE referrals
  ADD CONSTRAINT fk_referrals_profiles_referrer
  FOREIGN KEY (referrer_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE referrals
  ADD CONSTRAINT fk_referrals_profiles_referred
  FOREIGN KEY (referred_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- ------------------------------------------------
-- 12. Tạo bảng system_logs - Logs hệ thống
-- ------------------------------------------------
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  description TEXT,
  user_id UUID,
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tạo index cho action_type và timestamp
CREATE INDEX IF NOT EXISTS system_logs_action_type_idx ON system_logs(action_type);
CREATE INDEX IF NOT EXISTS system_logs_timestamp_idx ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS system_logs_user_id_idx ON system_logs(user_id);

-- Thêm foreign key
ALTER TABLE system_logs
  ADD CONSTRAINT fk_system_logs_profiles
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE SET NULL;

-- ------------------------------------------------
-- 13. Tạo function handle_new_user - tạo profile tự động
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
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

-- Tạo trigger cho user mới
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------
-- 14. Tạo các index bổ sung để tối ưu hiệu suất
-- ------------------------------------------------
CREATE INDEX IF NOT EXISTS profiles_level_idx ON profiles(level);
CREATE INDEX IF NOT EXISTS profiles_referral_code_idx ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS game_rounds_created_by_idx ON game_rounds(created_by);
CREATE INDEX IF NOT EXISTS bets_is_winner_idx ON bets(is_winner);

-- ------------------------------------------------
-- 15. Bật lại các triggers
-- ------------------------------------------------
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
    EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE TRIGGER %I', 
      trigger_rec.relname, trigger_rec.tgname);
  END LOOP;
END $$;

-- Đảm bảo trigger auth.users luôn bật
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- ================================================================
-- KẾT THÚC FILE SQL
-- ================================================================