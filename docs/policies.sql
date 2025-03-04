-- ================================================================
-- File: setup_rls_policies.sql
-- Mục đích: Bật RLS và tạo đầy đủ policies cho tất cả bảng
-- ================================================================

-- ------------------------------------------------
-- 0. Bật RLS cho tất cả bảng
-- ------------------------------------------------

-- Bật RLS cho tất cả bảng
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------
-- 1. Policies cho bảng profiles
-- ------------------------------------------------

-- Xóa policies hiện có nếu có
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;

-- Tạo policies mới
-- Select: User có thể xem thông tin cơ bản của tất cả người dùng, Admin xem tất cả
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT USING (true);

-- Insert: Chỉ Admin có thể tạo profile mới (thường thông qua trigger handle_new_user)
CREATE POLICY "profiles_insert_admin" ON profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: User chỉ có thể cập nhật profile của chính họ
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Update: Admin có thể cập nhật bất kỳ profile nào
CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa profile (hiếm khi cần dùng)
CREATE POLICY "profiles_delete_admin" ON profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 2. Policies cho bảng game_rounds
-- ------------------------------------------------

DROP POLICY IF EXISTS "game_rounds_select_all" ON game_rounds;
DROP POLICY IF EXISTS "game_rounds_insert_admin" ON game_rounds;
DROP POLICY IF EXISTS "game_rounds_update_admin" ON game_rounds;
DROP POLICY IF EXISTS "game_rounds_delete_admin" ON game_rounds;

-- Select: Tất cả người dùng đều có thể xem thông tin lượt chơi
CREATE POLICY "game_rounds_select_all" ON game_rounds
    FOR SELECT USING (true);

-- Insert: Chỉ Admin có thể tạo lượt chơi mới
CREATE POLICY "game_rounds_insert_admin" ON game_rounds
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật lượt chơi
CREATE POLICY "game_rounds_update_admin" ON game_rounds
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa lượt chơi
CREATE POLICY "game_rounds_delete_admin" ON game_rounds
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 3. Policies cho bảng bets
-- ------------------------------------------------

DROP POLICY IF EXISTS "bets_select_all" ON bets;
DROP POLICY IF EXISTS "bets_insert_own" ON bets;
DROP POLICY IF EXISTS "bets_insert_admin" ON bets;
DROP POLICY IF EXISTS "bets_update_admin" ON bets;
DROP POLICY IF EXISTS "bets_delete_admin" ON bets;

-- Select: Tất cả người dùng đều có thể xem thông tin đặt cược
CREATE POLICY "bets_select_all" ON bets
    FOR SELECT USING (true);

-- Insert: User có thể đặt cược của chính họ
CREATE POLICY "bets_insert_own" ON bets
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert: Admin có thể đặt cược cho bất kỳ ai
CREATE POLICY "bets_insert_admin" ON bets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật đặt cược (ví dụ: xác định người thắng)
CREATE POLICY "bets_update_admin" ON bets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa đặt cược
CREATE POLICY "bets_delete_admin" ON bets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 4. Policies cho bảng payment_requests
-- ------------------------------------------------

DROP POLICY IF EXISTS "payment_requests_select_own" ON payment_requests;
DROP POLICY IF EXISTS "payment_requests_select_admin" ON payment_requests;
DROP POLICY IF EXISTS "payment_requests_insert_own" ON payment_requests;
DROP POLICY IF EXISTS "payment_requests_insert_admin" ON payment_requests;
DROP POLICY IF EXISTS "payment_requests_update_admin" ON payment_requests;
DROP POLICY IF EXISTS "payment_requests_delete_admin" ON payment_requests;

-- Select: User chỉ có thể xem yêu cầu thanh toán của họ
CREATE POLICY "payment_requests_select_own" ON payment_requests
    FOR SELECT USING (user_id = auth.uid());

-- Select: Admin có thể xem tất cả yêu cầu thanh toán
CREATE POLICY "payment_requests_select_admin" ON payment_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: User có thể tạo yêu cầu thanh toán của họ
CREATE POLICY "payment_requests_insert_own" ON payment_requests
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert: Admin có thể tạo yêu cầu thanh toán cho bất kỳ ai
CREATE POLICY "payment_requests_insert_admin" ON payment_requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật yêu cầu thanh toán (phê duyệt/từ chối)
CREATE POLICY "payment_requests_update_admin" ON payment_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa yêu cầu thanh toán
CREATE POLICY "payment_requests_delete_admin" ON payment_requests
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 5. Policies cho bảng reward_codes
-- ------------------------------------------------

DROP POLICY IF EXISTS "reward_codes_select_own" ON reward_codes;
DROP POLICY IF EXISTS "reward_codes_select_admin" ON reward_codes;
DROP POLICY IF EXISTS "reward_codes_insert_admin" ON reward_codes;
DROP POLICY IF EXISTS "reward_codes_update_own" ON reward_codes;
DROP POLICY IF EXISTS "reward_codes_update_admin" ON reward_codes;
DROP POLICY IF EXISTS "reward_codes_delete_admin" ON reward_codes;

-- Select: User chỉ có thể xem mã thưởng của họ
CREATE POLICY "reward_codes_select_own" ON reward_codes
    FOR SELECT USING (user_id = auth.uid());

-- Select: Admin có thể xem tất cả mã thưởng
CREATE POLICY "reward_codes_select_admin" ON reward_codes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: Chỉ Admin có thể tạo mã thưởng
CREATE POLICY "reward_codes_insert_admin" ON reward_codes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: User có thể cập nhật mã thưởng của họ (đổi thưởng)
CREATE POLICY "reward_codes_update_own" ON reward_codes
    FOR UPDATE USING (user_id = auth.uid());

-- Update: Admin có thể cập nhật bất kỳ mã thưởng nào
CREATE POLICY "reward_codes_update_admin" ON reward_codes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa mã thưởng
CREATE POLICY "reward_codes_delete_admin" ON reward_codes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 6. Policies cho bảng user_statistics
-- ------------------------------------------------

DROP POLICY IF EXISTS "user_statistics_select_own" ON user_statistics;
DROP POLICY IF EXISTS "user_statistics_select_admin" ON user_statistics;
DROP POLICY IF EXISTS "user_statistics_insert_admin" ON user_statistics;
DROP POLICY IF EXISTS "user_statistics_update_admin" ON user_statistics;
DROP POLICY IF EXISTS "user_statistics_delete_admin" ON user_statistics;

-- Select: User chỉ có thể xem thống kê của họ
CREATE POLICY "user_statistics_select_own" ON user_statistics
    FOR SELECT USING (user_id = auth.uid());

-- Select: Admin có thể xem tất cả thống kê
CREATE POLICY "user_statistics_select_admin" ON user_statistics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: Chỉ Admin có thể tạo thống kê mới
CREATE POLICY "user_statistics_insert_admin" ON user_statistics
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật thống kê
CREATE POLICY "user_statistics_update_admin" ON user_statistics
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa thống kê
CREATE POLICY "user_statistics_delete_admin" ON user_statistics
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 7. Policies cho bảng promotions
-- ------------------------------------------------

DROP POLICY IF EXISTS "promotions_select_all" ON promotions;
DROP POLICY IF EXISTS "promotions_insert_admin" ON promotions;
DROP POLICY IF EXISTS "promotions_update_admin" ON promotions;
DROP POLICY IF EXISTS "promotions_delete_admin" ON promotions;

-- Select: Tất cả người dùng đều có thể xem khuyến mãi
CREATE POLICY "promotions_select_all" ON promotions
    FOR SELECT USING (true);

-- Insert: Chỉ Admin có thể tạo khuyến mãi mới
CREATE POLICY "promotions_insert_admin" ON promotions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật khuyến mãi
CREATE POLICY "promotions_update_admin" ON promotions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa khuyến mãi
CREATE POLICY "promotions_delete_admin" ON promotions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 8. Policies cho bảng promotion_usages
-- ------------------------------------------------

DROP POLICY IF EXISTS "promotion_usages_select_own" ON promotion_usages;
DROP POLICY IF EXISTS "promotion_usages_select_admin" ON promotion_usages;
DROP POLICY IF EXISTS "promotion_usages_insert_own" ON promotion_usages;
DROP POLICY IF EXISTS "promotion_usages_insert_admin" ON promotion_usages;
DROP POLICY IF EXISTS "promotion_usages_update_admin" ON promotion_usages;
DROP POLICY IF EXISTS "promotion_usages_delete_admin" ON promotion_usages;

-- Select: User chỉ có thể xem lượt sử dụng khuyến mãi của họ
CREATE POLICY "promotion_usages_select_own" ON promotion_usages
    FOR SELECT USING (user_id = auth.uid());

-- Select: Admin có thể xem tất cả lượt sử dụng khuyến mãi
CREATE POLICY "promotion_usages_select_admin" ON promotion_usages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: User có thể tạo lượt sử dụng khuyến mãi của họ
CREATE POLICY "promotion_usages_insert_own" ON promotion_usages
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert: Admin có thể tạo lượt sử dụng khuyến mãi cho bất kỳ ai
CREATE POLICY "promotion_usages_insert_admin" ON promotion_usages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật lượt sử dụng khuyến mãi
CREATE POLICY "promotion_usages_update_admin" ON promotion_usages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa lượt sử dụng khuyến mãi
CREATE POLICY "promotion_usages_delete_admin" ON promotion_usages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 9. Policies cho bảng notifications
-- ------------------------------------------------

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
DROP POLICY IF EXISTS "notifications_select_admin" ON notifications;
DROP POLICY IF EXISTS "notifications_insert_admin" ON notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
DROP POLICY IF EXISTS "notifications_update_admin" ON notifications;
DROP POLICY IF EXISTS "notifications_delete_admin" ON notifications;

-- Select: User chỉ có thể xem thông báo của họ
CREATE POLICY "notifications_select_own" ON notifications
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Select: Admin có thể xem tất cả thông báo
CREATE POLICY "notifications_select_admin" ON notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: Chỉ Admin có thể tạo thông báo
CREATE POLICY "notifications_insert_admin" ON notifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: User có thể cập nhật thông báo của họ (đánh dấu đã đọc)
CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Update: Admin có thể cập nhật bất kỳ thông báo nào
CREATE POLICY "notifications_update_admin" ON notifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa thông báo
CREATE POLICY "notifications_delete_admin" ON notifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 10. Policies cho bảng referrals
-- ------------------------------------------------

DROP POLICY IF EXISTS "referrals_select_own" ON referrals;
DROP POLICY IF EXISTS "referrals_select_admin" ON referrals;
DROP POLICY IF EXISTS "referrals_insert_own" ON referrals;
DROP POLICY IF EXISTS "referrals_insert_admin" ON referrals;
DROP POLICY IF EXISTS "referrals_update_admin" ON referrals;
DROP POLICY IF EXISTS "referrals_delete_admin" ON referrals;

-- Select: User chỉ có thể xem thông tin giới thiệu của họ
CREATE POLICY "referrals_select_own" ON referrals
    FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Select: Admin có thể xem tất cả thông tin giới thiệu
CREATE POLICY "referrals_select_admin" ON referrals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: User có thể tạo giới thiệu của họ
CREATE POLICY "referrals_insert_own" ON referrals
    FOR INSERT WITH CHECK (referrer_id = auth.uid());

-- Insert: Admin có thể tạo giới thiệu cho bất kỳ ai
CREATE POLICY "referrals_insert_admin" ON referrals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật thông tin giới thiệu
CREATE POLICY "referrals_update_admin" ON referrals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa thông tin giới thiệu
CREATE POLICY "referrals_delete_admin" ON referrals
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 11. Policies cho bảng system_logs
-- ------------------------------------------------

DROP POLICY IF EXISTS "system_logs_select_admin" ON system_logs;
DROP POLICY IF EXISTS "system_logs_insert_admin" ON system_logs;
DROP POLICY IF EXISTS "system_logs_delete_admin" ON system_logs;

-- Select: Chỉ Admin có thể xem logs hệ thống
CREATE POLICY "system_logs_select_admin" ON system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert: Chỉ Admin có thể tạo logs hệ thống
CREATE POLICY "system_logs_insert_admin" ON system_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa logs hệ thống
CREATE POLICY "system_logs_delete_admin" ON system_logs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ------------------------------------------------
-- 12. Policies cho bảng user_levels
-- ------------------------------------------------

DROP POLICY IF EXISTS "user_levels_select_all" ON user_levels;
DROP POLICY IF EXISTS "user_levels_insert_admin" ON user_levels;
DROP POLICY IF EXISTS "user_levels_update_admin" ON user_levels;
DROP POLICY IF EXISTS "user_levels_delete_admin" ON user_levels;

-- Select: Tất cả người dùng đều có thể xem thông tin cấp độ
CREATE POLICY "user_levels_select_all" ON user_levels
    FOR SELECT USING (true);

-- Insert: Chỉ Admin có thể tạo cấp độ mới
CREATE POLICY "user_levels_insert_admin" ON user_levels
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update: Chỉ Admin có thể cập nhật cấp độ
CREATE POLICY "user_levels_update_admin" ON user_levels
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delete: Chỉ Admin có thể xóa cấp độ
CREATE POLICY "user_levels_delete_admin" ON user_levels
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ================================================================
-- KẾT THÚC FILE SQL
-- ================================================================