-- Kích hoạt RLS cho tất cả các bảng trong schema public
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;

-- Kích hoạt RLS cho bảng auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

---------------------------
-- Policies cho bảng profiles
---------------------------

-- Ai cũng có thể xem tất cả profiles
CREATE POLICY profiles_select_all
ON public.profiles
FOR SELECT
USING (true);

-- Chỉ admin mới có thể thêm profiles mới
CREATE POLICY profiles_insert_admin
ON public.profiles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles profiles_1
    WHERE profiles_1.id = auth.uid() AND profiles_1.role = 'admin'
  )
);

-- Người dùng có thể cập nhật thông tin profile của chính mình
CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
USING (id = auth.uid());

-- Admin có thể cập nhật bất kỳ profile nào
CREATE POLICY profiles_update_admin
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles profiles_1
    WHERE profiles_1.id = auth.uid() AND profiles_1.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa profiles
CREATE POLICY profiles_delete_admin
ON public.profiles
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles profiles_1
    WHERE profiles_1.id = auth.uid() AND profiles_1.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng game_rounds
---------------------------

-- Ai cũng có thể xem tất cả game_rounds
CREATE POLICY game_rounds_select_policy
ON public.game_rounds
FOR SELECT
USING (true);

-- Chỉ admin mới có thể thêm game_rounds mới
CREATE POLICY game_rounds_insert_policy
ON public.game_rounds
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật game_rounds
CREATE POLICY game_rounds_update_policy
ON public.game_rounds
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa game_rounds
CREATE POLICY game_rounds_delete_policy
ON public.game_rounds
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng bets
---------------------------

-- Ai cũng có thể xem toàn bộ bets (chính sách chung)
CREATE POLICY bets_select_policy
ON public.bets
FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng chỉ có thể đặt cược cho chính mình và khi game round đang active
CREATE POLICY bets_insert_policy
ON public.bets
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1
    FROM game_rounds
    WHERE game_rounds.id = bets.game_round_id AND game_rounds.status = 'active'
  )
);

-- Chỉ admin mới có thể cập nhật bets
CREATE POLICY bets_update_policy
ON public.bets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa bets
CREATE POLICY bets_delete_policy
ON public.bets
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng reward_codes
---------------------------

-- Người dùng chỉ có thể xem mã thưởng của mình
CREATE POLICY reward_codes_select_own
ON public.reward_codes
FOR SELECT
USING (user_id = auth.uid());

-- Admin có thể xem tất cả mã thưởng
CREATE POLICY reward_codes_select_admin
ON public.reward_codes
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể thêm mã thưởng
CREATE POLICY reward_codes_insert_admin
ON public.reward_codes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng có thể cập nhật mã thưởng của mình
CREATE POLICY reward_codes_update_own
ON public.reward_codes
FOR UPDATE
USING (user_id = auth.uid());

-- Admin có thể cập nhật bất kỳ mã thưởng nào
CREATE POLICY reward_codes_update_admin
ON public.reward_codes
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa mã thưởng
CREATE POLICY reward_codes_delete_admin
ON public.reward_codes
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng payment_requests
---------------------------

-- Người dùng chỉ có thể xem yêu cầu thanh toán của mình
CREATE POLICY payment_requests_select_own
ON public.payment_requests
FOR SELECT
USING (user_id = auth.uid());

-- Admin có thể xem tất cả yêu cầu thanh toán
CREATE POLICY payment_requests_select_admin
ON public.payment_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng có thể tạo yêu cầu thanh toán cho chính mình
CREATE POLICY payment_requests_insert_own
ON public.payment_requests
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admin có thể tạo yêu cầu thanh toán
CREATE POLICY payment_requests_insert_admin
ON public.payment_requests
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật yêu cầu thanh toán
CREATE POLICY payment_requests_update_admin
ON public.payment_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa yêu cầu thanh toán
CREATE POLICY payment_requests_delete_admin
ON public.payment_requests
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng user_statistics
---------------------------

-- Người dùng chỉ có thể xem thống kê của mình
CREATE POLICY user_statistics_select_own
ON public.user_statistics
FOR SELECT
USING (user_id = auth.uid());

-- Admin có thể xem tất cả thống kê người dùng
CREATE POLICY user_statistics_select_admin
ON public.user_statistics
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể thêm thống kê
CREATE POLICY user_statistics_insert_admin
ON public.user_statistics
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật thống kê
CREATE POLICY user_statistics_update_admin
ON public.user_statistics
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa thống kê
CREATE POLICY user_statistics_delete_admin
ON public.user_statistics
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng promotions
---------------------------

-- Ai cũng có thể xem tất cả khuyến mãi
CREATE POLICY promotions_select_all
ON public.promotions
FOR SELECT
USING (true);

-- Chỉ admin mới có thể thêm khuyến mãi
CREATE POLICY promotions_insert_admin
ON public.promotions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật khuyến mãi
CREATE POLICY promotions_update_admin
ON public.promotions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa khuyến mãi
CREATE POLICY promotions_delete_admin
ON public.promotions
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng promotion_usages
---------------------------

-- Người dùng chỉ có thể xem việc sử dụng khuyến mãi của mình
CREATE POLICY promotion_usages_select_own
ON public.promotion_usages
FOR SELECT
USING (user_id = auth.uid());

-- Admin có thể xem tất cả việc sử dụng khuyến mãi
CREATE POLICY promotion_usages_select_admin
ON public.promotion_usages
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng có thể tạo việc sử dụng khuyến mãi cho chính mình
CREATE POLICY promotion_usages_insert_own
ON public.promotion_usages
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admin có thể tạo việc sử dụng khuyến mãi
CREATE POLICY promotion_usages_insert_admin
ON public.promotion_usages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật việc sử dụng khuyến mãi
CREATE POLICY promotion_usages_update_admin
ON public.promotion_usages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa việc sử dụng khuyến mãi
CREATE POLICY promotion_usages_delete_admin
ON public.promotion_usages
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng notifications
---------------------------

-- Người dùng có thể xem thông báo của họ và thông báo chung
CREATE POLICY notifications_select_own
ON public.notifications
FOR SELECT
USING ((user_id = auth.uid()) OR (user_id IS NULL));

-- Admin có thể xem tất cả thông báo
CREATE POLICY notifications_select_admin
ON public.notifications
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể tạo thông báo
CREATE POLICY notifications_insert_admin
ON public.notifications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng có thể cập nhật thông báo của mình
CREATE POLICY notifications_update_own
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid());

-- Admin có thể cập nhật bất kỳ thông báo nào
CREATE POLICY notifications_update_admin
ON public.notifications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa thông báo
CREATE POLICY notifications_delete_admin
ON public.notifications
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng referrals
---------------------------

-- Người dùng có thể xem thông tin giới thiệu liên quan đến họ
CREATE POLICY referrals_select_own
ON public.referrals
FOR SELECT
USING ((referrer_id = auth.uid()) OR (referred_id = auth.uid()));

-- Admin có thể xem tất cả thông tin giới thiệu
CREATE POLICY referrals_select_admin
ON public.referrals
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng có thể thêm thông tin giới thiệu với họ là người giới thiệu
CREATE POLICY referrals_insert_own
ON public.referrals
FOR INSERT
WITH CHECK (referrer_id = auth.uid());

-- Admin có thể thêm bất kỳ thông tin giới thiệu nào
CREATE POLICY referrals_insert_admin
ON public.referrals
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật thông tin giới thiệu
CREATE POLICY referrals_update_admin
ON public.referrals
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa thông tin giới thiệu
CREATE POLICY referrals_delete_admin
ON public.referrals
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng system_logs
---------------------------

-- Chỉ admin mới có thể xem nhật ký hệ thống
CREATE POLICY system_logs_select_admin
ON public.system_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể thêm nhật ký hệ thống
CREATE POLICY system_logs_insert_admin
ON public.system_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa nhật ký hệ thống
CREATE POLICY system_logs_delete_admin
ON public.system_logs
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

---------------------------
-- Policies cho bảng user_levels
---------------------------

-- Ai cũng có thể xem tất cả cấp độ người dùng
CREATE POLICY user_levels_select_all
ON public.user_levels
FOR SELECT
USING (true);

-- Chỉ admin mới có thể thêm cấp độ người dùng
CREATE POLICY user_levels_insert_admin
ON public.user_levels
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể cập nhật cấp độ người dùng
CREATE POLICY user_levels_update_admin
ON public.user_levels
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Chỉ admin mới có thể xóa cấp độ người dùng
CREATE POLICY user_levels_delete_admin
ON public.user_levels
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);


-- ------------------------------------------------
-- RLS Policies cho bucket storage.objects
-- ------------------------------------------------

-- 1. Policy cho phép người dùng select (xem) avatar của mình và của người khác
CREATE POLICY "Người dùng có thể xem avatar"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'user_avatars'
);

-- 2. Policy cho phép người dùng upload avatar của chính mình
CREATE POLICY "Người dùng có thể upload avatar của mình"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'user_avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Policy cho phép người dùng update avatar của chính mình
CREATE POLICY "Người dùng có thể cập nhật avatar của mình"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'user_avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy cho phép người dùng xóa avatar của chính mình
CREATE POLICY "Người dùng có thể xóa avatar của mình"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'user_avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 1. Policy cho phép người dùng xem minh chứng thanh toán của chính mình
CREATE POLICY "Người dùng có thể xem minh chứng thanh toán của mình"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment_proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Policy cho phép admin xem minh chứng thanh toán của tất cả người dùng
CREATE POLICY "Admin có thể xem tất cả minh chứng thanh toán"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment_proofs' AND
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. Policy cho phép người dùng upload minh chứng thanh toán
CREATE POLICY "Người dùng có thể upload minh chứng thanh toán"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment_proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy cho phép người dùng xóa minh chứng thanh toán của chính mình
CREATE POLICY "Người dùng có thể xóa minh chứng thanh toán của mình"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payment_proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Chỉ admin có thể xem thông tin user auth
CREATE POLICY "Chỉ admin có thể xem thông tin user" 
ON auth.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Người dùng có thể cập nhật email và password của chính mình
CREATE POLICY "Người dùng cập nhật thông tin auth của mình" 
ON auth.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Chỉ admin mới có thể xóa user
CREATE POLICY "Chỉ admin có thể xóa user" 
ON auth.users 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);