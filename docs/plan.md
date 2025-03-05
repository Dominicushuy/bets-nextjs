# Kế hoạch phát triển chi tiết dự án Game Cá Cược (Task-based)

## Tuần 1: Thiết lập cơ sở hạ tầng và xác thực

### Ngày 1-2: Thiết lập dự án và database

1. [ ] Tạo project Supabase mới
2. [ ] Cài đặt Next.js 14 với App Router
3. [ ] Cấu hình TailwindCSS và thư viện UI
4. [ ] Thiết lập cấu trúc thư mục dự án
5. [ ] Tạo file environment và cấu hình

### Ngày 3-4: Thiết lập Database Schema

1. [ ] Chạy SQL script để tạo bảng và mối quan hệ
2. [ ] Thiết lập Triggers và Functions cơ bản
3. [ ] Cấu hình RLS Policies cho các bảng
4. [ ] Cài đặt Storage Buckets cho uploads

### Ngày 5: Tích hợp Supabase Client

1. [ ] Cài đặt và cấu hình Supabase Client
2. [ ] Tạo các utility functions để giao tiếp với Supabase
3. [ ] Thiết lập Authentication Provider

## Tuần 2: Phát triển xác thực và UI Components

### Ngày 1-2: Xây dựng Auth Components

1. [ ] Tạo Login Form component
2. [ ] Tạo Register Form component
3. [ ] Xây dựng Forgot Password workflow
4. [ ] Phát triển Auth Provider và hooks

### Ngày 3-4: API Routes xác thực

1. [ ] Tạo API route đăng ký `/api/auth/register`
2. [ ] Tạo API route đăng nhập `/api/auth/login`
3. [ ] Tạo API route reset mật khẩu `/api/auth/reset-password`
4. [ ] Tạo API route cập nhật profile `/api/profile`

### Ngày 5: UI Components cơ bản

1. [ ] Phát triển Button component với variants
2. [ ] Phát triển Card component với variants
3. [ ] Phát triển Input, Checkbox, Select components
4. [ ] Phát triển Loading và Alert components

## Tuần 3: Layout và Profile

### Ngày 1-2: Xây dựng Layout

1. [ ] Tạo Root Layout với providers
2. [ ] Tạo Dashboard Layout với navigation
3. [ ] Tạo Admin Layout với sidebar
4. [ ] Tạo Auth Layout

### Ngày 3-4: Trang Profile

1. [ ] Xây dựng trang Profile với form cập nhật thông tin
2. [ ] Phát triển component upload avatar
3. [ ] Tạo API route upload file `/api/upload`
4. [ ] Phát triển hooks quản lý profile

### Ngày 5: Trang Dashboard và History

1. [ ] Tạo Dashboard page với các widget
2. [ ] Tạo components hiển thị thống kê người dùng
3. [ ] Phát triển trang History
4. [ ] Tạo API routes cho history và thống kê

## Tuần 4: Game System

### Ngày 1-2: Game List

1. [ ] Tạo trang Games list
2. [ ] Phát triển Game Card component
3. [ ] Tạo API route lấy danh sách games `/api/game-rounds`
4. [ ] Phát triển hooks quản lý games

### Ngày 3-5: Game Detail

1. [ ] Tạo trang Game Detail
2. [ ] Phát triển component đặt cược
3. [ ] Tạo API route game detail `/api/game-rounds/[id]`
4. [ ] Tạo API route đặt cược `/api/game-rounds/bets`
5. [ ] Thiết lập real-time subscriptions cho game status

## Tuần 5: Betting System

### Ngày 1-2: Betting UI

1. [ ] Phát triển Bet Form với validation
2. [ ] Tạo Bet Confirmation dialog
3. [ ] Phát triển Game Status component
4. [ ] Xây dựng Bet List component

### Ngày 3-5: Betting Backend

1. [ ] Tạo SQL function place_bet
2. [ ] Thiết lập trigger sau khi đặt cược
3. [ ] Cài đặt RLS cho bets
4. [ ] Tạo SQL function cập nhật số dư người dùng

## Tuần 6: Game Results

### Ngày 1-2: Game Results UI

1. [ ] Phát triển Game Result component
2. [ ] Tạo animations cho hiển thị kết quả
3. [ ] Xây dựng Result Summary component
4. [ ] Phát triển hooks quản lý kết quả

### Ngày 3-5: Game Results Backend

1. [ ] Tạo SQL function complete_game_round
2. [ ] Tạo API route hoàn thành lượt chơi `/api/game-rounds/[id]/complete`
3. [ ] Tạo API route kết quả lượt chơi `/api/game-rounds/[id]/results`
4. [ ] Thiết lập trigger tạo phần thưởng khi game kết thúc

## Tuần 7: Reward System

### Ngày 1-2: Reward UI

1. [ ] Tạo trang Rewards
2. [ ] Phát triển Reward Card component
3. [ ] Xây dựng Reward QR component
4. [ ] Tạo hooks quản lý rewards

### Ngày 3-5: Reward Backend

1. [ ] Tạo SQL function create_winner_rewards
2. [ ] Tạo SQL function redeem_reward
3. [ ] Tạo API route đổi thưởng `/api/rewards/[code]/redeem`
4. [ ] Thiết lập RLS cho rewards

## Tuần 8: Payment System

### Ngày 1-2: Payment Request UI

1. [ ] Tạo trang Payment Request
2. [ ] Phát triển Payment Form component
3. [ ] Xây dựng Upload Proof component
4. [ ] Tạo hooks quản lý payment requests

### Ngày 3-5: Payment Request Backend

1. [ ] Tạo SQL function update_user_balance
2. [ ] Tạo API route payment requests `/api/payment-requests`
3. [ ] Tạo API route xử lý payment request `/api/payment-requests/[id]`
4. [ ] Thiết lập RLS cho payment requests

## Tuần 9: Admin Dashboard

### Ngày 1-2: Admin Dashboard UI

1. [ ] Tạo trang Admin Dashboard
2. [ ] Phát triển Admin Stats components
3. [ ] Xây dựng biểu đồ và visualizations
4. [ ] Tạo hooks quản lý admin stats

### Ngày 3-5: Admin Dashboard Backend

1. [ ] Tạo API route dashboard summary `/api/admin/dashboard-summary`
2. [ ] Tạo SQL queries cho thống kê
3. [ ] Thiết lập RLS cho admin access
4. [ ] Tạo API route system logs `/api/admin/logs`

## Tuần 10: User Management (Admin)

### Ngày 1-2: User Management UI

1. [ ] Tạo trang Users List
2. [ ] Phát triển User Detail component
3. [ ] Xây dựng User Edit Form
4. [ ] Tạo hooks quản lý users

### Ngày 3-5: User Management Backend

1. [ ] Tạo API route users list `/api/admin/users`
2. [ ] Tạo API route user detail `/api/admin/users/[id]`
3. [ ] Tạo SQL functions quản lý user
4. [ ] Thiết lập RLS cho user management

## Tuần 11: Game Management (Admin)

### Ngày 1-2: Game Management UI

1. [ ] Tạo trang Games Management
2. [ ] Phát triển Create Game Form
3. [ ] Xây dựng Game Control Panel
4. [ ] Tạo hooks quản lý games (admin)

### Ngày 3-5: Game Management Backend

1. [ ] Tạo API route games list (admin) `/api/admin/games`
2. [ ] Tạo API route game detail (admin) `/api/admin/games/[id]`
3. [ ] Tạo SQL functions quản lý games
4. [ ] Thiết lập RLS cho game management

## Tuần 12: Payment Management (Admin)

### Ngày 1-2: Payment Management UI

1. [ ] Tạo trang Payment Requests Management
2. [ ] Phát triển Payment Approval Form
3. [ ] Xây dựng Payment History Table
4. [ ] Tạo hooks quản lý payments (admin)

### Ngày 3-5: Payment Management Backend

1. [ ] Tạo API route payment requests (admin) `/api/admin/payment-requests`
2. [ ] Tạo API route payment approval `/api/admin/payment-requests/[id]`
3. [ ] Tạo SQL functions xử lý payment approvals
4. [ ] Thiết lập RLS cho payment management

## Tuần 13: Notifications và Promotions

### Ngày 1-2: Notification System

1. [ ] Tạo Notification Provider
2. [ ] Phát triển Notification Component
3. [ ] Xây dựng Notification List
4. [ ] Tạo API route notifications `/api/notifications`

### Ngày 3-5: Promotion System

1. [ ] Tạo trang Promotions
2. [ ] Phát triển Promotion Card component
3. [ ] Tạo API route promotions `/api/promotions`
4. [ ] Thiết lập SQL functions cho promotions

## Tuần 14: Referral System và Polish

### Ngày 1-2: Referral System

1. [ ] Tạo trang Referrals
2. [ ] Phát triển Referral Link component
3. [ ] Tạo API route referrals `/api/referrals`
4. [ ] Thiết lập SQL functions cho referrals

### Ngày 3-5: Polishing & Bug Fixes

1. [ ] Tối ưu hóa performance
2. [ ] Refactor code redundancies
3. [ ] Cải thiện responsive design
4. [ ] Fix bugs và edge cases

## Tuần 15: Testing

### Ngày 1-2: Unit Testing

1. [ ] Viết tests cho components
2. [ ] Viết tests cho hooks
3. [ ] Viết tests cho utils
4. [ ] Viết tests cho API routes

### Ngày 3-5: Integration Testing

1. [ ] Viết tests cho luồng authentication
2. [ ] Viết tests cho luồng betting
3. [ ] Viết tests cho luồng payment
4. [ ] Viết tests cho admin actions

## Tuần 16: Deployment & Documentation

### Ngày 1-2: Deployment

1. [ ] Cấu hình production environment
2. [ ] Set up CI/CD pipeline
3. [ ] Deploy to Vercel
4. [ ] Deploy Supabase production database

### Ngày 3-5: Documentation

1. [ ] Viết API documentation
2. [ ] Viết user guide
3. [ ] Viết admin guide
4. [ ] Chuẩn bị tài liệu training
