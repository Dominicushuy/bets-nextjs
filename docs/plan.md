# Kế hoạch phát triển chi tiết dự án Game Cá Cược

## 1. Thiết lập nền tảng và cơ sở hạ tầng

### 1.1 Thiết lập dự án và môi trường phát triển (2 ngày)

#### Backend (Supabase)
- [ ] Tạo dự án Supabase mới
- [ ] Cấu hình authentication với các providers (email, phone)
- [ ] Thiết lập security policies và environment variables
- [ ] Cấu hình storage buckets cho uploads (avatar, payment proofs)
- [ ] Kiểm tra kết nối và khả năng truy cập

#### Frontend (Next.js)
- [ ] Khởi tạo dự án Next.js 14 với App Router
- [ ] Cài đặt và cấu hình các dependencies cốt lõi (TailwindCSS, HeadlessUI, React Query)
- [ ] Thiết lập cấu trúc thư mục theo mô hình đã định nghĩa
- [ ] Cấu hình ESLint, TypeScript và các công cụ phát triển
- [ ] Tạo các providers chính (auth, notifications, toast)
- [ ] Tạo utility functions và hooks cơ bản

### 1.2 Thiết lập Database Schema và RLS Policies (3 ngày)

#### Database Schema
- [ ] Chạy script schema.sql và kiểm tra tất cả các bảng đã được tạo
- [ ] Xác minh các quan hệ và ràng buộc đã được thiết lập chính xác
- [ ] Cập nhật schema nếu cần thiết dựa trên yêu cầu mới
- [ ] Tạo dữ liệu mẫu cho môi trường phát triển

#### Triggers và Functions
- [ ] Chạy script trigger_functions.sql và kiểm tra các function đã được tạo
- [ ] Kiểm tra hoạt động của function handle_new_user
- [ ] Kiểm tra các triggers đã được đăng ký đúng
- [ ] Phát triển thêm functions cho các nghiệp vụ còn thiếu:
  - [ ] Cập nhật cấp độ người dùng khi đạt đủ điểm kinh nghiệm
  - [ ] Tính toán thống kê người dùng realtime
  - [ ] Xử lý phân phối phần thưởng tự động

#### RLS Policies
- [ ] Chạy script policies.sql và kiểm tra các policies đã được tạo
- [ ] Kiểm tra các policies với môi trường test
- [ ] Bổ sung policies cho các bảng mới nếu có
- [ ] Tinh chỉnh policies để tối ưu bảo mật và hiệu suất

## 2. Phát triển hệ thống xác thực và quản lý người dùng

### 2.1 Xây dựng hệ thống Authentication (4 ngày)

#### Backend
- [ ] Cấu hình Supabase Auth với email và phone providers
- [ ] Phát triển function xử lý đăng ký người dùng mới 
- [ ] Tạo trigger tự động tạo profile khi user mới được tạo
- [ ] Thiết lập policies cho auth.users và profiles

#### Frontend Components
- [ ] Xây dựng LoginForm component (email/phone, validation, reCaptcha)
- [ ] Xây dựng RegisterForm component (validation, điều khoản sử dụng)
- [ ] Tạo ForgotPasswordForm và ResetPasswordForm components
- [ ] Xây dựng AuthLayout cho các trang authentication

#### API Routes
- [ ] Tạo API route `/api/auth/register` (xử lý đăng ký, gửi email xác nhận)
- [ ] Tạo API route `/api/auth/login` (xác thực, tạo session)
- [ ] Tạo API route `/api/auth/verify-email` (xác minh email)
- [ ] Tạo API route `/api/auth/reset-password` và `/api/auth/forgot-password`

#### Services & Hooks
- [ ] Phát triển AuthService (login, register, reset password)
- [ ] Xây dựng hook useAuth để quản lý trạng thái authentication
- [ ] Tạo AuthProvider context để chia sẻ trạng thái đăng nhập
- [ ] Tạo middleware để kiểm tra authentication cho các routes được bảo vệ

### 2.2 Quản lý hồ sơ người dùng (4 ngày)

#### Backend
- [ ] Tạo functions cập nhật profile người dùng
- [ ] Phát triển trigger kiểm tra cập nhật cấp độ dựa trên điểm kinh nghiệm
- [ ] Thiết lập policies cho truy cập và cập nhật profiles

#### Frontend Components
- [ ] Xây dựng ProfileForm component (cập nhật thông tin cá nhân)
- [ ] Tạo AvatarUpload component với preview và crop
- [ ] Phát triển UserLevelProgress component (hiển thị cấp độ, XP)
- [ ] Xây dựng UserStatistics component (tỷ lệ thắng, lịch sử cược)

#### API Routes
- [ ] Tạo API route `/api/profile` (get/update thông tin profile)
- [ ] Tạo API route `/api/profile/avatar` (upload/update avatar)
- [ ] Tạo API route `/api/profile/level-progress` (lấy thông tin cấp độ, XP)
- [ ] Tạo API route `/api/profile/change-password` (đổi mật khẩu)

#### Services & Hooks
- [ ] Phát triển ProfileService (getProfile, updateProfile)
- [ ] Xây dựng hook useProfile để quản lý thông tin profile
- [ ] Tạo hook useProfileStats để lấy thống kê người dùng
- [ ] Phát triển hook useAvatar để quản lý upload và cập nhật avatar

### 2.3 Hệ thống cấp độ và thống kê người dùng (3 ngày)

#### Backend
- [ ] Tạo function tính toán cập nhật user_statistics
- [ ] Phát triển function cập nhật cấp độ và phúc lợi tương ứng
- [ ] Thiết lập triggers tự động cập nhật statistics khi có hoạt động mới

#### Frontend Components
- [ ] Xây dựng LevelBadge component hiển thị cấp độ và icon
- [ ] Tạo UserLevelDetails component (hiển thị các phúc lợi theo cấp độ)
- [ ] Phát triển StatisticsChart component (biểu đồ thắng/thua theo thời gian)
- [ ] Xây dựng UserStatsCards với các số liệu thống kê quan trọng

#### API Routes
- [ ] Tạo API route `/api/statistics/user` (lấy thống kê chi tiết người dùng)
- [ ] Tạo API route `/api/statistics/level-benefits` (lấy phúc lợi theo cấp độ)
- [ ] Tạo API route `/api/statistics/activities` (lấy lịch sử hoạt động)

#### Services & Hooks
- [ ] Phát triển StatisticsService (getUserStats, getLevelBenefits)
- [ ] Xây dựng hook useUserStatistics để quản lý thống kê
- [ ] Tạo hook useLevelProgress theo dõi tiến trình lên cấp

## 3. Phát triển hệ thống Game và Cá cược

### 3.1 Quản lý lượt chơi và danh sách game (5 ngày)

#### Backend
- [ ] Bổ sung functions CRUD cho game_rounds
- [ ] Tạo function tạo lượt chơi mới tự động theo lịch
- [ ] Phát triển triggers tự động thông báo khi có lượt chơi mới
- [ ] Thiết lập realtime subscriptions cho cập nhật trạng thái game

#### Frontend Components
- [ ] Xây dựng GameList component (danh sách lượt chơi với filters)
- [ ] Tạo GameCard component (hiển thị thông tin tóm tắt lượt chơi)
- [ ] Phát triển GameFilters component (lọc theo trạng thái, thời gian)
- [ ] Xây dựng GameListSkeleton cho trạng thái loading

#### API Routes
- [ ] Tạo API route `/api/game-rounds` (lấy danh sách lượt chơi)
- [ ] Tạo API route `/api/game-rounds/[id]` (chi tiết lượt chơi)
- [ ] Tạo API route `/api/game-rounds/active` (lấy các lượt chơi đang diễn ra)
- [ ] Tạo API route `/api/admin/game-rounds` (CRUD lượt chơi - admin)

#### Services & Hooks
- [ ] Phát triển GameService (getGames, getGameById)
- [ ] Xây dựng hook useGames để quản lý danh sách games
- [ ] Tạo hook useGame để quản lý chi tiết game
- [ ] Phát triển hook useGameSubscription để nhận cập nhật realtime

### 3.2 Hệ thống đặt cược (5 ngày)

#### Backend
- [ ] Phát triển function place_bet xử lý đặt cược
- [ ] Tạo trigger cập nhật số dư người dùng khi đặt cược
- [ ] Thiết lập realtime subscriptions cho cập nhật đặt cược
- [ ] Cài đặt RLS policies cho bets

#### Frontend Components
- [ ] Xây dựng BetForm component (chọn số và số tiền cược)
- [ ] Tạo BetConfirmation component (xác nhận đặt cược)
- [ ] Phát triển BetSuccess animation khi đặt cược thành công
- [ ] Xây dựng BetList component (danh sách cược đã đặt)

#### API Routes
- [ ] Tạo API route `/api/game-rounds/[id]/bets` (đặt cược mới)
- [ ] Tạo API route `/api/game-rounds/[id]/my-bets` (lấy cược của user hiện tại)
- [ ] Tạo API route `/api/game-rounds/[id]/bet-stats` (thống kê cược)

#### Services & Hooks
- [ ] Phát triển BetService (placeBet, getUserBets)
- [ ] Xây dựng hook usePlaceBet để xử lý đặt cược
- [ ] Tạo hook useUserBets để quản lý cược của user
- [ ] Phát triển hook useBetStats để lấy thống kê cược

### 3.3 Xử lý kết quả và thông báo (4 ngày)

#### Backend
- [ ] Phát triển function complete_game_round xử lý hoàn thành game
- [ ] Tạo function phân phối tiền thưởng cho người thắng
- [ ] Thiết lập triggers cập nhật user_statistics khi game kết thúc
- [ ] Cấu hình notifications khi có kết quả

#### Frontend Components
- [ ] Xây dựng GameResult component (hiển thị kết quả lượt chơi)
- [ ] Tạo WinnerAnimation component (hiệu ứng khi thắng)
- [ ] Phát triển GameResultDetails component (chi tiết kết quả)
- [ ] Xây dựng GameResultNotification component (thông báo kết quả)

#### API Routes
- [ ] Tạo API route `/api/game-rounds/[id]/complete` (hoàn thành lượt chơi - admin)
- [ ] Tạo API route `/api/game-rounds/[id]/results` (lấy kết quả)
- [ ] Tạo API route `/api/game-rounds/[id]/winners` (danh sách người thắng)

#### Services & Hooks
- [ ] Phát triển GameResultService (getResults, getWinners)
- [ ] Xây dựng hook useGameResults để quản lý kết quả game
- [ ] Tạo hook useWinCheck để kiểm tra người dùng có thắng không
- [ ] Phát triển hook useConfetti cho hiệu ứng animation khi thắng

### 3.4 Thống kê game (3 ngày)

#### Backend
- [ ] Phát triển function get_game_stats xử lý thống kê game
- [ ] Tạo function lấy phân phối số lượng đặt cược
- [ ] Thiết lập cached queries để tối ưu hiệu suất

#### Frontend Components
- [ ] Xây dựng GameStats component (hiển thị thống kê tổng quan)
- [ ] Tạo BetDistributionChart component (biểu đồ phân phối đặt cược)
- [ ] Phát triển WinningNumbersChart component (thống kê số trúng thưởng)
- [ ] Xây dựng GameProfitChart component (biểu đồ lợi nhuận/thua lỗ)

#### API Routes
- [ ] Tạo API route `/api/game-rounds/[id]/stats` (thống kê lượt chơi)
- [ ] Tạo API route `/api/game-stats/number-distribution` (phân phối số)
- [ ] Tạo API route `/api/game-stats/profit-analysis` (phân tích lợi nhuận)

#### Services & Hooks
- [ ] Phát triển GameStatsService (getGameStats, getNumberDistribution)
- [ ] Xây dựng hook useGameStats để quản lý thống kê game
- [ ] Tạo hook useNumberDistribution cho phân tích số
- [ ] Phát triển hook useGameCharts cho tạo biểu đồ thống kê

## 4. Quản lý tài chính

### 4.1 Hệ thống nạp tiền (4 ngày)

#### Backend
- [ ] Phát triển function xử lý tạo yêu cầu nạp tiền
- [ ] Tạo function phê duyệt/từ chối yêu cầu nạp tiền
- [ ] Thiết lập triggers cập nhật số dư khi yêu cầu được phê duyệt
- [ ] Cấu hình RLS policies cho payment_requests

#### Frontend Components
- [ ] Xây dựng DepositForm component (form yêu cầu nạp tiền)
- [ ] Tạo PaymentProofUpload component (upload minh chứng)
- [ ] Phát triển PaymentRequestList component (danh sách yêu cầu)
- [ ] Xây dựng PaymentStatus component (theo dõi trạng thái)

#### API Routes
- [ ] Tạo API route `/api/payment-requests` (tạo yêu cầu nạp tiền)
- [ ] Tạo API route `/api/payment-requests/[id]` (chi tiết yêu cầu)
- [ ] Tạo API route `/api/payment-requests/upload-proof` (upload minh chứng)
- [ ] Tạo API route `/api/admin/payment-requests/approve` (phê duyệt - admin)

#### Services & Hooks
- [ ] Phát triển PaymentService (createRequest, getRequests)
- [ ] Xây dựng hook usePaymentRequests để quản lý yêu cầu
- [ ] Tạo hook usePaymentStatus để theo dõi trạng thái
- [ ] Phát triển hook useUploadProof cho upload minh chứng

### 4.2 Quản lý giao dịch (3 ngày)

#### Backend
- [ ] Phát triển function lấy lịch sử giao dịch
- [ ] Tạo function tổng hợp số liệu tài chính
- [ ] Thiết lập triggers ghi log giao dịch tự động

#### Frontend Components
- [ ] Xây dựng TransactionHistory component (lịch sử giao dịch)
- [ ] Tạo TransactionFilters component (lọc theo loại, thời gian)
- [ ] Phát triển TransactionDetail component (chi tiết giao dịch)
- [ ] Xây dựng FinancialSummary component (tổng quan tài chính)

#### API Routes
- [ ] Tạo API route `/api/transactions` (lấy lịch sử giao dịch)
- [ ] Tạo API route `/api/transactions/summary` (tổng hợp tài chính)
- [ ] Tạo API route `/api/transactions/export` (xuất dữ liệu ra file)

#### Services & Hooks
- [ ] Phát triển TransactionService (getTransactions, getTransactionById)
- [ ] Xây dựng hook useTransactions để quản lý giao dịch
- [ ] Tạo hook useTransactionSummary để tổng hợp tài chính
- [ ] Phát triển hook useTransactionExport để xuất dữ liệu

### 4.3 Quản lý rút tiền (3 ngày)

#### Backend
- [ ] Phát triển function xử lý yêu cầu rút tiền
- [ ] Tạo function phê duyệt/từ chối yêu cầu rút tiền
- [ ] Thiết lập triggers kiểm tra số dư hợp lệ khi rút tiền

#### Frontend Components
- [ ] Xây dựng WithdrawalForm component (form yêu cầu rút tiền)
- [ ] Tạo WithdrawalMethodSelect component (chọn phương thức)
- [ ] Phát triển WithdrawalHistory component (lịch sử rút tiền)
- [ ] Xây dựng WithdrawalStatus component (theo dõi trạng thái)

#### API Routes
- [ ] Tạo API route `/api/payment-requests/withdraw` (tạo yêu cầu rút tiền)
- [ ] Tạo API route `/api/payment-requests/withdraw/[id]` (chi tiết yêu cầu)
- [ ] Tạo API route `/api/admin/payment-requests/withdraw/approve` (phê duyệt - admin)

#### Services & Hooks
- [ ] Phát triển WithdrawalService (createRequest, getRequests)
- [ ] Xây dựng hook useWithdrawalRequests để quản lý yêu cầu
- [ ] Tạo hook useWithdrawalStatus để theo dõi trạng thái
- [ ] Phát triển hook useWithdrawalMethods cho phương thức rút tiền

## 5. Hệ thống phần thưởng

### 5.1 Quản lý mã thưởng (4 ngày)

#### Backend
- [ ] Phát triển function tạo mã thưởng tự động cho người thắng
- [ ] Tạo function kiểm tra và sử dụng mã thưởng
- [ ] Thiết lập triggers kiểm tra hết hạn mã thưởng tự động
- [ ] Cấu hình RLS policies cho bảng reward_codes

#### Frontend Components
- [ ] Xây dựng RewardCodesList component (danh sách mã thưởng)
- [ ] Tạo RewardCodeCard component (hiển thị mã và thông tin)
- [ ] Phát triển RewardQRCode component (QR code cho mã thưởng)
- [ ] Xây dựng RedeemRewardForm component (form đổi mã thưởng)

#### API Routes
- [ ] Tạo API route `/api/rewards` (lấy danh sách mã thưởng)
- [ ] Tạo API route `/api/rewards/[code]` (chi tiết mã thưởng)
- [ ] Tạo API route `/api/rewards/[code]/qr` (tạo QR code)
- [ ] Tạo API route `/api/rewards/[code]/redeem` (đổi mã thưởng)

#### Services & Hooks
- [ ] Phát triển RewardService (getRewardCodes, redeemCode)
- [ ] Xây dựng hook useRewardCodes để quản lý mã thưởng
- [ ] Tạo hook useRedeemReward để xử lý đổi thưởng
- [ ] Phát triển hook useRewardQR để tạo và quản lý QR codes

### 5.2 Đổi thưởng (3 ngày)

#### Backend
- [ ] Phát triển function redeem_reward để đổi phần thưởng
- [ ] Tạo triggers cập nhật số dư sau khi đổi thưởng thành công
- [ ] Thiết lập notification khi đổi thưởng

#### Frontend Components
- [ ] Xây dựng RedeemForm component (form nhập mã và đổi thưởng)
- [ ] Tạo RedeemSuccessDialog component (thông báo thành công)
- [ ] Phát triển RedeemHistoryList component (lịch sử đổi thưởng)
- [ ] Xây dựng RewardDetailDialog component (chi tiết phần thưởng)

#### API Routes
- [ ] Tạo API route `/api/rewards/redeem` (xử lý đổi thưởng)
- [ ] Tạo API route `/api/rewards/history` (lịch sử đổi thưởng)
- [ ] Tạo API route `/api/rewards/validate-code` (kiểm tra mã hợp lệ)

#### Services & Hooks
- [ ] Phát triển RedeemService (redeemReward, getHistory)
- [ ] Xây dựng hook useRedeemHistory để quản lý lịch sử
- [ ] Tạo hook useCodeValidator để kiểm tra mã hợp lệ
- [ ] Phát triển hook useRewardBalance để theo dõi số dư thưởng

### 5.3 Chương trình VIP và phần thưởng trung thành (3 ngày)

#### Backend
- [ ] Phát triển function quản lý cấp độ VIP và phúc lợi
- [ ] Tạo function phân phối phần thưởng theo milestone, sinh nhật
- [ ] Thiết lập triggers tự động cập nhật cấp độ VIP

#### Frontend Components
- [ ] Xây dựng VIPLevelCard component (hiển thị cấp độ VIP)
- [ ] Tạo VIPBenefitsList component (danh sách phúc lợi)
- [ ] Phát triển LoyaltyPointsCard component (điểm trung thành)
- [ ] Xây dựng SpecialRewardsSection component (phần thưởng đặc biệt)

#### API Routes
- [ ] Tạo API route `/api/vip/level` (lấy thông tin cấp độ VIP)
- [ ] Tạo API route `/api/vip/benefits` (lấy phúc lợi VIP)
- [ ] Tạo API route `/api/loyalty/points` (lấy điểm trung thành)
- [ ] Tạo API route `/api/loyalty/rewards` (phần thưởng có thể đổi)

#### Services & Hooks
- [ ] Phát triển VIPService (getVIPLevel, getBenefits)
- [ ] Xây dựng hook useVIPStatus để quản lý trạng thái VIP
- [ ] Tạo hook useLoyaltyPoints để quản lý điểm trung thành
- [ ] Phát triển hook useSpecialRewards cho phần thưởng đặc biệt

## 6. Chương trình khuyến mãi & Giới thiệu

### 6.1 Quản lý khuyến mãi (4 ngày)

#### Backend
- [ ] Phát triển function quản lý khuyến mãi (tạo, cập nhật, xóa)
- [ ] Tạo function áp dụng khuyến mãi cho người dùng
- [ ] Thiết lập RLS policies cho bảng promotions

#### Frontend Components
- [ ] Xây dựng PromotionsList component (danh sách khuyến mãi)
- [ ] Tạo PromotionCard component (hiển thị thông tin khuyến mãi)
- [ ] Phát triển PromotionDetail component (chi tiết khuyến mãi)
- [ ] Xây dựng ClaimPromotionButton component (nhận khuyến mãi)

#### API Routes
- [ ] Tạo API route `/api/promotions` (lấy danh sách khuyến mãi)
- [ ] Tạo API route `/api/promotions/[id]` (chi tiết khuyến mãi)
- [ ] Tạo API route `/api/promotions/[id]/claim` (nhận khuyến mãi)
- [ ] Tạo API route `/api/admin/promotions` (CRUD khuyến mãi - admin)

#### Services & Hooks
- [ ] Phát triển PromotionService (getPromotions, claimPromotion)
- [ ] Xây dựng hook usePromotions để quản lý khuyến mãi
- [ ] Tạo hook useClaimPromotion để xử lý nhận khuyến mãi
- [ ] Phát triển hook usePromotionEligibility để kiểm tra điều kiện

### 6.2 Hệ thống giới thiệu (4 ngày)

#### Backend
- [ ] Phát triển function tạo và quản lý mã giới thiệu
- [ ] Tạo function xử lý khi người được giới thiệu đăng ký
- [ ] Thiết lập triggers phân phối thưởng giới thiệu

#### Frontend Components
- [ ] Xây dựng ReferralCodeCard component (hiển thị mã giới thiệu)
- [ ] Tạo ReferralShareLinks component (chia sẻ qua nhiều kênh)
- [ ] Phát triển ReferralStatistics component (thống kê giới thiệu)
- [ ] Xây dựng ReferralsList component (danh sách người đã giới thiệu)

#### API Routes
- [ ] Tạo API route `/api/referrals/code` (lấy/tạo mã giới thiệu)
- [ ] Tạo API route `/api/referrals/stats` (thống kê giới thiệu)
- [ ] Tạo API route `/api/referrals/list` (danh sách người được giới thiệu)
- [ ] Tạo API route `/api/referrals/rewards` (phần thưởng từ giới thiệu)

#### Services & Hooks
- [ ] Phát triển ReferralService (getReferralCode, getReferrals)
- [ ] Xây dựng hook useReferralCode để quản lý mã giới thiệu
- [ ] Tạo hook useReferralStats để theo dõi thống kê giới thiệu
- [ ] Phát triển hook useReferralRewards cho phần thưởng giới thiệu

### 6.3 Khuyến mãi theo sự kiện & mùa vụ (3 ngày)

#### Backend
- [ ] Phát triển function quản lý các sự kiện theo mùa vụ
- [ ] Tạo function áp dụng khuyến mãi theo thời gian thực

#### Frontend Components
- [ ] Xây dựng SeasonalPromotions component (khuyến mãi theo mùa)
- [ ] Tạo EventCountdown component (đếm ngược sự kiện)
- [ ] Phát triển SpecialEventBanner component (banner sự kiện đặc biệt)
- [ ] Xây dựng HolidayTheme component (giao diện theo ngày lễ)

#### API Routes
- [ ] Tạo API route `/api/promotions/seasonal` (khuyến mãi theo mùa)
- [ ] Tạo API route `/api/promotions/events` (sự kiện đặc biệt)
- [ ] Tạo API route `/api/promotions/upcoming` (sự kiện sắp tới)

#### Services & Hooks
- [ ] Phát triển SeasonalService (getSeasonalPromotions, getEvents)
- [ ] Xây dựng hook useSeasonalPromos để quản lý khuyến mãi theo mùa
- [ ] Tạo hook useEventCountdown để theo dõi sự kiện sắp tới
- [ ] Phát triển hook useThemeDetector để thay đổi giao diện theo sự kiện

## 7. Hệ thống thông báo

### 7.1 Thông báo trong ứng dụng (3 ngày)

#### Backend
- [ ] Phát triển function tạo và quản lý thông báo
- [ ] Tạo triggers tự động tạo thông báo cho các sự kiện
- [ ] Thiết lập RLS policies cho bảng notifications

#### Frontend Components
- [ ] Xây dựng NotificationDropdown component (dropdown thông báo)
- [ ] Tạo NotificationList component (danh sách thông báo)
- [ ] Phát triển NotificationItem component (item thông báo)
- [ ] Xây dựng NotificationBadge component (badge số lượng chưa đọc)

#### API Routes
- [ ] Tạo API route `/api/notifications` (lấy danh sách thông báo)
- [ ] Tạo API route `/api/notifications/[id]/read` (đánh dấu đã đọc)
- [ ] Tạo API route `/api/notifications/read-all` (đánh dấu tất cả đã đọc)
- [ ] Tạo API route `/api/notifications/count` (số lượng thông báo chưa đọc)

#### Services & Hooks
- [ ] Phát triển NotificationService (getNotifications, markAsRead)
- [ ] Xây dựng hook useNotifications để quản lý thông báo
- [ ] Tạo hook useUnreadCount để theo dõi số lượng chưa đọc
- [ ] Phát triển hook useNotificationSubscription cho cập nhật realtime

### 7.2 Thông báo đa kênh (4 ngày)

#### Backend
- [ ] Phát triển function gửi thông báo qua Email
- [ ] Tạo function gửi thông báo qua Telegram
- [ ] Thiết lập triggers tự động gửi thông báo đa kênh

#### Frontend Components
- [ ] Xây dựng NotificationPreferences component (tùy chọn thông báo)
- [ ] Tạo TelegramConnect component (kết nối Telegram)
- [ ] Phát triển EmailPreferences component (tùy chọn email)
- [ ] Xây dựng NotificationTypesSettings component (loại thông báo)

#### API Routes
- [ ] Tạo API route `/api/notifications/settings` (thiết lập thông báo)
- [ ] Tạo API route `/api/notifications/channels` (quản lý kênh thông báo)
- [ ] Tạo API route `/api/notifications/telegram/connect` (kết nối Telegram)
- [ ] Tạo API route `/api/notifications/test` (gửi thông báo test)

#### Services & Hooks
- [ ] Phát triển NotificationChannelService (getChannels, updateSettings)
- [ ] Xây dựng hook useNotificationSettings để quản lý thiết lập
- [ ] Tạo hook useTelegramConnect để kết nối Telegram
- [ ] Phát triển hook useNotificationChannels cho các kênh thông báo

### 7.3 Thông báo thông minh (3 ngày)

#### Backend
- [ ] Phát triển function cá nhân hóa thông báo theo hành vi
- [ ] Tạo function phân tích hành vi người dùng để gợi ý game
- [ ] Thiết lập triggers gửi thông báo nhắc nhở thông minh

#### Frontend Components
- [ ] Xây dựng SmartNotification component (thông báo thông minh)
- [ ] Tạo GameSuggestion component (gợi ý game phù hợp)
- [ ] Phát triển IntelligentReminder component (nhắc nhở thông minh)
- [ ] Xây dựng PersonalizedMessage component (thông điệp cá nhân hóa)

#### API Routes
- [ ] Tạo API route `/api/notifications/smart` (thông báo thông minh)
- [ ] Tạo API route `/api/suggestions/games` (gợi ý game)
- [ ] Tạo API route `/api/reminders/smart` (nhắc nhở thông minh)

#### Services & Hooks
- [ ] Phát triển SmartNotificationService (getSmartNotifications)
- [ ] Xây dựng hook useSmartNotifications để quản lý thông báo thông minh
- [ ] Tạo hook useGameSuggestions để nhận gợi ý game
- [ ] Phát triển hook useIntelligentReminders cho nhắc nhở thông minh

## 8. Quản trị hệ thống (Admin)

### 8.1 Dashboard Admin (4 ngày)

#### Backend
- [ ] Phát triển function lấy dữ liệu tổng quan cho dashboard
- [ ] Tạo function thống kê theo thời gian thực
- [ ] Thiết lập RLS policies cho truy cập admin

#### Frontend Components
- [ ] Xây dựng AdminDashboard component (dashboard tổng quan)
- [ ] Tạo AdminStats component (thống kê quan trọng)
- [ ] Phát triển AdminCharts component (biểu đồ và visualizations)
- [ ] Xây dựng AdminAlerts component (cảnh báo và thông báo)

#### API Routes
- [ ] Tạo API route `/api/admin/dashboard-summary` (dữ liệu tổng quan)
- [ ] Tạo API route `/api/admin/stats/realtime` (thống kê realtime)
- [ ] Tạo API route `/api/admin/alerts` (cảnh báo hệ thống)
- [ ] Tạo API route `/api/admin/metrics` (các metrics quan trọng)

#### Services & Hooks
- [ ] Phát triển AdminDashboardService (getDashboardData, getMetrics)
- [ ] Xây dựng hook useAdminDashboard để quản lý dữ liệu dashboard
- [ ] Tạo hook useAdminStats để theo dõi thống kê
- [ ] Phát triển hook useAdminAlerts cho cảnh báo hệ thống

### 8.2 Quản lý người dùng (4 ngày)

#### Backend
- [ ] Phát triển function quản lý danh sách người dùng
- [ ] Tạo function phân tích hành vi và phát hiện gian lận
- [ ] Thiết lập triggers ghi log hoạt động admin

#### Frontend Components
- [ ] Xây dựng UserManagement component (quản lý người dùng)
- [ ] Tạo UserDetail component (thông tin chi tiết người dùng)
- [ ] Phát triển UserActionLogs component (lịch sử hoạt động)
- [ ] Xây dựng UserFilters component (lọc và tìm kiếm nâng cao)

#### API Routes
- [ ] Tạo API route `/api/admin/users` (danh sách người dùng)
- [ ] Tạo API route `/api/admin/users/[id]` (chi tiết người dùng)
- [ ] Tạo API route `/api/admin/users/[id]/logs` (logs hoạt động)
- [ ] Tạo API route `/api/admin/users/[id]/update` (cập nhật thông tin)

#### Services & Hooks
- [ ] Phát triển AdminUserService (getUsers, getUserById, updateUser)
- [ ] Xây dựng hook useAdminUsers để quản lý danh sách người dùng
- [ ] Tạo hook useUserDetail để xem chi tiết người dùng
- [ ] Phát triển hook useUserSearch cho tìm kiếm và lọc

### 8.3 Quản lý game (3 ngày)

#### Backend
- [ ] Phát triển function quản lý trò chơi và vòng chơi
- [ ] Tạo function điều chỉnh kết quả và thanh toán
- [ ] Thiết lập triggers tự động tạo lượt chơi mới

#### Frontend Components
- [ ] Xây dựng GameManagement component (quản lý trò chơi)
- [ ] Tạo GameRoundControl component (điều khiển vòng chơi)
- [ ] Phát triển GameResultInput component (nhập kết quả)
- [ ] Xây dựng GameScheduler component (lập lịch trò chơi)

#### API Routes
- [ ] Tạo API route `/api/admin/games` (quản lý trò chơi)
- [ ] Tạo API route `/api/admin/games/[id]/rounds` (quản lý vòng chơi)
- [ ] Tạo API route `/api/admin/games/[id]/results` (quản lý kết quả)
- [ ] Tạo API route `/api/admin/games/schedule` (lập lịch trò chơi)

#### Services & Hooks
- [ ] Phát triển AdminGameService (getGames, createGame, updateGame)
- [ ] Xây dựng hook useAdminGames để quản lý trò chơi
- [ ] Tạo hook useGameControl để điều khiển vòng chơi
- [ ] Phát triển hook useGameScheduler cho lập lịch trò chơi

### 8.4 Quản lý thanh toán (3 ngày)

#### Backend
- [ ] Phát triển function xét duyệt yêu cầu thanh toán
- [ ] Tạo function đối soát và báo cáo tài chính
- [ ] Thiết lập triggers cập nhật số dư khi phê duyệt

#### Frontend Components
- [ ] Xây dựng PaymentRequestsManagement component (quản lý yêu cầu)
- [ ] Tạo PaymentApproval component (phê duyệt thanh toán)
- [ ] Phát triển PaymentProofViewer component (xem minh chứng)
- [ ] Xây dựng PaymentReports component (báo cáo thanh toán)

#### API Routes
- [ ] Tạo API route `/api/admin/payment-requests` (danh sách yêu cầu)
- [ ] Tạo API route `/api/admin/payment-requests/[id]/approve` (phê duyệt)
- [ ] Tạo API route `/api/admin/payment-requests/[id]/reject` (từ chối)
- [ ] Tạo API route `/api/admin/payment-reports` (báo cáo thanh toán)

#### Services & Hooks
- [ ] Phát triển AdminPaymentService (getRequests, approveRequest)
- [ ] Xây dựng hook useAdminPayments để quản lý yêu cầu thanh toán
- [ ] Tạo hook usePaymentApproval để xử lý phê duyệt
- [ ] Phát triển hook usePaymentReports cho báo cáo tài chính

### 8.5 Báo cáo & phân tích (4 ngày)

#### Backend
- [ ] Phát triển function tạo báo cáo tổng hợp
- [ ] Tạo function phân tích dữ liệu và xu hướng
- [ ] Thiết lập scheduled jobs cho báo cáo định kỳ

#### Frontend Components
- [ ] Xây dựng ReportsCenter component (trung tâm báo cáo)
- [ ] Tạo AnalyticsCharts component (biểu đồ phân tích)
- [ ] Phát triển TrendAnalysis component (phân tích xu hướng)
- [ ] Xây dựng ReportGenerator component (tạo báo cáo tùy chỉnh)

#### API Routes
- [ ] Tạo API route `/api/admin/reports` (danh sách báo cáo có sẵn)
- [ ] Tạo API route `/api/admin/reports/generate` (tạo báo cáo mới)
- [ ] Tạo API route `/api/admin/analytics` (dữ liệu phân tích)
- [ ] Tạo API route `/api/admin/reports/export` (xuất báo cáo)

#### Services & Hooks
- [ ] Phát triển AdminReportService (getReports, generateReport)
- [ ] Xây dựng hook useAdminReports để quản lý báo cáo
- [ ] Tạo hook useAnalytics để phân tích dữ liệu
- [ ] Phát triển hook useReportExport cho xuất báo cáo

## 9. Giao diện người dùng và trải nghiệm

### 9.1 Layout và navigations (3 ngày)

#### Frontend Components
- [ ] Xây dựng MainLayout component (layout chính)
- [ ] Tạo Header component với responsive design
- [ ] Phát triển SideNavigation component (thanh điều hướng)
- [ ] Xây dựng Footer component với thông tin liên hệ
- [ ] Tạo MobileMenu component cho thiết bị di động

### 9.2 Animations và hiệu ứng (3 ngày)

#### Frontend Components
- [ ] Xây dựng PageTransition component (hiệu ứng chuyển trang)
- [ ] Tạo LoadingSpinner component với animations
- [ ] Phát triển WinningEffect component (hiệu ứng khi thắng)
- [ ] Xây dựng NumberSelectionAnimation component
- [ ] Tạo Toast notifications với animations

### 9.3 Responsive design (4 ngày)

#### Frontend Components
- [ ] Tối ưu hóa tất cả components cho mobile và tablet
- [ ] Phát triển AdaptiveLayout system
- [ ] Xây dựng MediaQuery hooks cho responsive logic
- [ ] Tạo MobileSpecific components cho UX tốt hơn trên mobile

## 10. Testing và Quality Assurance

### 10.1 Unit Testing (5 ngày)
- [ ] Viết tests cho các utility functions
- [ ] Viết tests cho các hooks
- [ ] Viết tests cho các services
- [ ] Viết tests cho các critical components

### 10.2 Integration Testing (4 ngày)
- [ ] Viết tests cho luồng authentication
- [ ] Viết tests cho luồng betting
- [ ] Viết tests cho luồng payment
- [ ] Viết tests cho luồng admin actions

### 10.3 End-to-End Testing (4 ngày)
- [ ] Thiết lập Cypress cho E2E testing
- [ ] Viết E2E tests cho luồng đăng ký và đăng nhập
- [ ] Viết E2E tests cho luồng đặt cược và xem kết quả
- [ ] Viết E2E tests cho admin dashboard

## 11. Deployment và CI/CD

### 11.1 Triển khai môi trường Staging (3 ngày)
- [ ] Cấu hình Supabase cho môi trường staging
- [ ] Triển khai Next.js app lên Vercel staging
- [ ] Thiết lập môi trường variables cho staging
- [ ] Tạo dữ liệu mẫu cho testing

### 11.2 Thiết lập CI/CD (2 ngày)
- [ ] Cấu hình GitHub Actions cho CI
- [ ] Thiết lập quy trình auto deployment
- [ ] Cấu hình tests tự động chạy khi PR
- [ ] Thiết lập monitoring và notifications

### 11.3 Triển khai Production (2 ngày)
- [ ] Cấu hình Supabase production
- [ ] Triển khai Next.js app lên Vercel production
- [ ] Thiết lập theo dõi lỗi với Sentry
- [ ] Cấu hình monitoring với Datadog hoặc New Relic

## 12. Tài liệu hóa

### 12.1 Tài liệu kỹ thuật (3 ngày)
- [ ] Tạo tài liệu API documentation
- [ ] Viết tài liệu database schema
- [ ] Tạo flow diagrams cho các quy trình chính
- [ ] Viết tài liệu architecture và design patterns

### 12.2 Tài liệu người dùng (2 ngày)
- [ ] Viết hướng dẫn sử dụng cho người dùng
- [ ] Tạo FAQs và troubleshooting guide
- [ ] Viết hướng dẫn đặt cược và rút tiền
- [ ] Tạo video tutorials cho các tính năng phức tạp

### 12.3 Tài liệu vận hành (2 ngày)
- [ ] Viết tài liệu deployment và cập nhật
- [ ] Tạo run book cho các vấn đề phổ biến
- [ ] Viết tài liệu backup và disaster recovery
- [ ] Tạo tài liệu monitoring và alerts

## Tổng kết
Kế hoạch phát triển này bao gồm 12 phần chính với tổng cộng khoảng 95 ngày làm việc (khoảng 4.5 tháng với lịch 5 ngày làm việc/tuần). Kế hoạch đã được phân chia chi tiết theo từng tính năng và bao gồm cả backend, frontend, testing và deployment.

Các mốc quan trọng:
1. **Milestone 1 (Tuần 4)**: Hoàn thành nền tảng cơ bản và xác thực
2. **Milestone 2 (Tuần 8)**: Hoàn thành hệ thống Game và Cá cược
3. **Milestone 3 (Tuần 12)**: Hoàn thành quản lý tài chính và phần thưởng
4. **Milestone 4 (Tuần 16)**: Hoàn thành hệ thống khuyến mãi và thông báo
5. **Milestone 5 (Tuần 19)**: Hoàn thành admin dashboard và báo cáo

Mỗi milestone sẽ được kèm theo một đợt demo và review để đảm bảo dự án đang đi đúng hướng và đáp ứng yêu cầu.