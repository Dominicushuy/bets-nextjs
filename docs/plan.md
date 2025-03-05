# Kế hoạch phát triển chi tiết dự án Game Cá Cược

## I. Tổng quan dự án

**Tên dự án:** Game Cá Cược  
**Mục tiêu:** Xây dựng nền tảng cá cược trực tuyến với hệ thống quản lý người dùng, trò chơi, đặt cược, thanh toán và phần thưởng  
**Công nghệ chính:**
- Frontend: Next.js 14 (App Router), React, TailwindCSS
- Backend: Supabase (Authentication, Database, Storage, RPC)
- Database: PostgreSQL (quản lý qua Supabase)
- State Management: React Query (TanStack Query)
- Authentication: Supabase Auth

## II. Giai đoạn phát triển

### Giai đoạn 1: Thiết lập cơ sở hạ tầng và xác thực người dùng (2 tuần)

#### Tuần 1: Thiết lập dự án và database
1. **Thiết lập dự án Next.js**
   - Cài đặt Next.js 14 với App Router
   - Cấu hình TailwindCSS
   - Thiết lập cấu trúc thư mục (pages, components, hooks, lib, services)
   - Tạo file environment (.env) và cấu hình hệ thống

2. **Cấu hình Supabase**
   - Tạo project Supabase
   - Setup Authentication (Email, Phone)
   - Upload và chạy schema.sql để tạo database schema
   - Thiết lập storage buckets cho uploads

3. **Thiết lập Database Schema**
   - Tạo bảng profiles, game_rounds, bets, payment_requests, user_statistics, v.v.
   - Tạo indexes và foreign keys
   - Thiết lập RLS Policies

#### Tuần 2: Xây dựng hệ thống xác thực và quản lý người dùng
1. **Xây dựng các trang xác thực**
   - Trang Login `/login`
   - Trang Register `/register`
   - Trang Forgot Password `/forgot-password`
   - Trang Reset Password `/reset-password`

2. **Xây dựng AuthProvider và hooks**
   - Tạo AuthProvider.tsx 
   - Phát triển hook useAuth
   - Thiết lập middleware bảo vệ routes

3. **Tạo các API routes xác thực**
   - Route đăng ký `/api/auth/register`
   - Route đăng nhập `/api/auth/login`
   - Route reset mật khẩu `/api/auth/reset-password`

4. **Xây dựng UI Components ban đầu**
   - Button component
   - Card component
   - Form components (Input, Select, etc.)
   - Dialog component
   - Loading component

### Giai đoạn 2: Phát triển quản lý người dùng và layout (2 tuần)

#### Tuần 3: Phát triển hồ sơ người dùng và layout
1. **Xây dựng layouts chính**
   - Layout `/src/app/layout.tsx` (Root layout)
   - Dashboard layout `/src/app/(dashboard)/layout.tsx`
   - Admin layout `/src/app/(admin)/layout.tsx`
   - Auth layout `/src/app/(auth)/layout.tsx`

2. **Trang hồ sơ người dùng**
   - Trang Profile `/profile`
   - Components cập nhật thông tin cá nhân
   - Avatar upload
   - Thống kê người dùng

3. **Tạo API routes cho hồ sơ**
   - Profile API route `/api/profile`
   - Upload API route `/api/upload`

4. **Phát triển hooks quản lý hồ sơ**
   - useExtendedUserProfile
   - useUpdateUserProfile
   - useUploadProfileAvatar

#### Tuần 4: Dashboard và provider chung
1. **Xây dựng Dashboard**
   - Trang Dashboard chính `/dashboard`
   - Components hiển thị thống kê người dùng
   - Hiển thị lượt chơi đang diễn ra

2. **Phát triển các providers chung**
   - ToastProvider
   - QueryProvider
   - NotificationProvider

3. **Tạo các shared components**
   - Navbar
   - Sidebar
   - Footer
   - Badges
   - Cards

4. **Lịch sử người dùng**
   - Trang History `/history`
   - Components hiển thị lịch sử đặt cược
   - Components hiển thị lịch sử thanh toán

### Giai đoạn 3: Phát triển hệ thống game và cá cược (3 tuần)

#### Tuần 5: Hệ thống Game
1. **Phát triển trang danh sách lượt chơi**
   - Trang Games `/games`
   - Games List component
   - Game Card component
   - Pagination component

2. **Xây dựng lọc và tìm kiếm**
   - Filter components
   - Search functionality
   - Status filters (Active, Completed, etc.)

3. **API Routes game**
   - Game rounds API `/api/game-rounds`
   - Game rounds detail API `/api/game-rounds/[id]`

4. **Hooks quản lý game**
   - useGameRounds
   - useGameRoundsRealtime

#### Tuần 6: Chi tiết Game và đặt cược
1. **Trang chi tiết lượt chơi**
   - Trang Game Detail `/games/[id]`
   - Game Detail component
   - Game Countdown component
   - Game Status component

2. **Hệ thống đặt cược**
   - BetForm component
   - Bet validation
   - Bet confirmation dialog

3. **API Routes đặt cược**
   - Place bet API `/api/game-rounds/bets`
   - Bet history API

4. **Real-time updates**
   - Realtime subscriptions cho đặt cược
   - Live activity feed
   - Status change notifications

#### Tuần 7: Kết quả và phần thưởng
1. **Hiển thị kết quả**
   - Game Result component
   - Winner Animation component
   - Results API `/api/game-rounds/[id]/results`

2. **Hệ thống phần thưởng**
   - Reward code display
   - Redeem reward functionality
   - Reward QR code

3. **Hooks và services liên quan**
   - useGameRoundResults
   - useRedeemReward

4. **API Routes phần thưởng**
   - Reward redeem API `/api/rewards/[code]/redeem`

### Giai đoạn 4: Phát triển hệ thống thanh toán (2 tuần)

#### Tuần 8: Yêu cầu nạp tiền và quản lý thanh toán
1. **Trang yêu cầu nạp tiền**
   - Payment Request form `/payment-request`
   - Upload proof component
   - Payment confirmation

2. **API Routes thanh toán**
   - Payment requests API `/api/payment-requests`
   - Payment approval API `/api/payment-requests/[id]`

3. **Hooks thanh toán**
   - usePaymentRequests
   - useCreatePaymentRequest
   - useProcessPaymentRequest

4. **UI Components thanh toán**
   - Payment status badges
   - Payment history table
   - Payment request card

#### Tuần 9: Hoàn thiện thanh toán và thống kê
1. **Trang lịch sử thanh toán**
   - Payment history page
   - Filter by date and status
   - Export functionality

2. **Thống kê tài chính người dùng**
   - Financial statistics component
   - Balance history chart
   - Transaction summary

3. **API Routes thống kê**
   - User statistics API `/api/profile/statistics`
   - Financial summary API `/api/profile/finances`

4. **Hooks và services liên quan**
   - useUserStatistics
   - useFinancialSummary

### Giai đoạn 5: Phát triển Admin Panel (3 tuần)

#### Tuần 10: Dashboard Admin và quản lý người dùng
1. **Admin Dashboard**
   - Admin Dashboard page `/admin/dashboard`
   - System statistics components
   - Key metrics visualization

2. **API Routes Admin**
   - Admin dashboard stats API `/api/admin/dashboard-summary`
   - System logs API `/api/admin/logs`

3. **Quản lý người dùng**
   - Users list page `/admin/users`
   - User details page `/admin/users/[id]`
   - User management forms

4. **Hooks và components admin**
   - useAdminStats
   - AdminSidebar component
   - AdminHeader component

#### Tuần 11: Quản lý trò chơi và thanh toán
1. **Quản lý lượt chơi**
   - Games management page `/admin/games`
   - Create game page `/admin/games/new`
   - Edit game page `/admin/games/[id]`
   - Complete game functionality

2. **API Routes quản lý trò chơi**
   - Admin games API `/api/admin/games`
   - Complete game API `/api/game-rounds/[id]/complete`

3. **Quản lý thanh toán**
   - Payment requests page `/admin/payment-requests`
   - Process payment form
   - Payment verification

4. **Hooks và components quản lý**
   - useAdminGames
   - useAdminPayments
   - AdminGameControl component
   - PaymentApproval component

#### Tuần 12: Quản lý phần thưởng, logs và báo cáo
1. **Quản lý phần thưởng**
   - Rewards management page `/admin/rewards`
   - Create reward form
   - Reward usage tracking

2. **Logs hệ thống**
   - System logs page `/admin/logs`
   - Activity filtering
   - Audit trail

3. **Báo cáo**
   - Reports page `/admin/reports`
   - Generate report functionality
   - Export to CSV/Excel

4. **Components và hooks liên quan**
   - useSystemLogs
   - useAdminReports
   - LogsTable component
   - ReportGenerator component

### Giai đoạn 6: Khuyến mãi và tính năng bổ sung (2 tuần)

#### Tuần 13: Khuyến mãi và giới thiệu
1. **Hệ thống khuyến mãi**
   - Promotions page `/promotions`
   - Admin promotions management `/admin/promotions`
   - Promotion usage tracking

2. **API Routes khuyến mãi**
   - Promotions API `/api/promotions`
   - Apply promotion API `/api/promotions/apply`

3. **Hệ thống giới thiệu**
   - Referral page `/referrals`
   - Referral code generation
   - Referral tracking

4. **Hooks và components liên quan**
   - usePromotions
   - useReferrals
   - PromotionCard component
   - ReferralLink component

#### Tuần 14: Thông báo và trang thông tin
1. **Hệ thống thông báo**
   - Notifications page `/notifications`
   - Real-time notifications
   - Email notifications

2. **API Routes thông báo**
   - Notifications API `/api/notifications`
   - Mark as read API `/api/notifications/mark-read`

3. **Trang thông tin**
   - About page `/about`
   - Terms page `/terms`
   - Privacy page `/privacy`
   - FAQ page `/faq`

4. **Components liên quan**
   - NotificationBell component
   - NotificationList component
   - Notification toasts

### Giai đoạn 7: Testing, Optimization và Deployment (2 tuần)

#### Tuần 15: Testing và Optimization
1. **Unit Testing**
   - Component tests
   - Hook tests
   - Service tests

2. **Integration Testing**
   - API route tests
   - Page tests
   - End-to-end flows

3. **Performance Optimization**
   - Bundle size optimization
   - Image optimization
   - Database query optimization
   - Caching strategies

4. **Mobile Responsiveness**
   - Testing on mobile devices
   - Responsive design fixes
   - Mobile UI enhancements

#### Tuần 16: Deployment và Monitoring
1. **Deployment**
   - Production build
   - Vercel deployment
   - Supabase production setup
   - Environment configuration

2. **Monitoring và Analytics**
   - Error tracking setup
   - Performance monitoring
   - User analytics

3. **Documentation**
   - API documentation
   - Admin guide
   - User guide
   - Technical documentation

4. **Final Testing and Launch**
   - UAT (User Acceptance Testing)
   - Security audits
   - Final fixes
   - Launch planning

## III. Cấu trúc thư mục

```
src/
├── app/                    # App Router
│   ├── (admin)/            # Admin routes
│   ├── (auth)/             # Auth routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Auth-related components
│   ├── dashboard/          # Dashboard components
│   ├── game/               # Game-related components
│   ├── history/            # History components
│   ├── layouts/            # Layout components
│   ├── payment/            # Payment components
│   ├── profile/            # Profile components
│   ├── ui/                 # UI Components
│   └── ...
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Utility functions
├── providers/              # Context providers
├── services/               # Service modules
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

## IV. Dependencies chính

- **Next.js**: Framework React cho SSR/SSG
- **React**: UI library
- **TailwindCSS**: Utility-first CSS framework
- **@supabase/auth-helpers-nextjs**: Auth helpers cho Next.js
- **@supabase/supabase-js**: Supabase JavaScript client
- **@tanstack/react-query**: Data fetching và state management
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **lucide-react**: Icon library
- **react-hot-toast**: Toast notifications
- **recharts**: Charting library
- **dayjs**: Date manipulation

## V. Supabase Setup

### Database Tables
- profiles
- game_rounds
- bets
- payment_requests
- reward_codes
- user_statistics
- promotions
- promotion_usages
- notifications
- referrals
- system_logs
- user_levels

### RLS Policies
- Profiles read/write permissions
- Game rounds permissions
- Bets permissions
- Payment requests permissions
- Reward codes permissions
- Notifications permissions

### Functions
- place_bet
- complete_game_round
- create_winner_rewards
- redeem_reward
- get_game_stats
- update_user_balance

## VI. Deliverables theo giai đoạn

### Giai đoạn 1 (2 tuần)
- Codebase với cấu trúc cơ bản
- Database schema được thiết lập
- Hệ thống xác thực người dùng
- UI Components cơ bản

### Giai đoạn 2 (2 tuần)
- Dashboard và layout hoàn chỉnh
- Quản lý hồ sơ người dùng
- Hệ thống providers
- Trang lịch sử người dùng

### Giai đoạn 3 (3 tuần)
- Trang danh sách lượt chơi
- Trang chi tiết lượt chơi và đặt cược
- Hệ thống phần thưởng và kết quả
- Real-time updates

### Giai đoạn 4 (2 tuần)
- Hệ thống thanh toán
- Trang và form yêu cầu nạp tiền
- Lịch sử thanh toán
- Thống kê tài chính

### Giai đoạn 5 (3 tuần)
- Admin dashboard
- Quản lý người dùng
- Quản lý trò chơi và thanh toán
- Quản lý phần thưởng và logs

### Giai đoạn 6 (2 tuần)
- Hệ thống khuyến mãi
- Hệ thống giới thiệu
- Hệ thống thông báo
- Trang thông tin

### Giai đoạn 7 (2 tuần)
- Tests
- Performance optimizations
- Deployment
- Documentation

## VII. Timeline tổng thể

**Tổng thời gian:** 16 tuần (4 tháng)
- **Giai đoạn 1:** Tuần 1-2
- **Giai đoạn 2:** Tuần 3-4
- **Giai đoạn 3:** Tuần 5-7
- **Giai đoạn 4:** Tuần 8-9
- **Giai đoạn 5:** Tuần 10-12
- **Giai đoạn 6:** Tuần 13-14
- **Giai đoạn 7:** Tuần 15-16

## VIII. Quản lý rủi ro

1. **Thay đổi yêu cầu**: Duy trì tài liệu yêu cầu rõ ràng và quy trình kiểm soát thay đổi
2. **Vấn đề kỹ thuật**: Nghiên cứu kỹ thuật từ đầu và có plan dự phòng
3. **Deadline slippage**: Buffer 20% thời gian cho mỗi giai đoạn
4. **Sự phức tạp không lường trước**: Đánh giá rủi ro thường xuyên và điều chỉnh plan khi cần

## IX. Các mốc quan trọng

1. **Week 2**: Hoàn thành auth và database setup
2. **Week 4**: Hoàn thành dashboard và profile
3. **Week 7**: Hoàn thành core game và betting functionality
4. **Week 9**: Hoàn thành payment system
5. **Week 12**: Hoàn thành admin panel
6. **Week 14**: Hoàn thành tất cả tính năng
7. **Week 16**: Sẵn sàng cho production

Kế hoạch này cung cấp một lộ trình chi tiết từ đầu cho việc phát triển dự án Game Cá Cược, với các giai đoạn, nhiệm vụ cụ thể, deliverables rõ ràng, và timeline ước tính, giúp đảm bảo quá trình phát triển có tổ chức và hiệu quả.