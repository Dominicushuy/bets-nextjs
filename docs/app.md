Directory structure:
└── dominicushuy-bets-nextjs/
    └── src/
        └── app/
            ├── globals.css
            ├── layout.tsx
            ├── page.tsx
            ├── (admin)/
            │   └── admin/
            │       ├── layout.tsx
            │       ├── dashboard/
            │       │   └── page.tsx
            │       ├── games/
            │       │   ├── page.tsx
            │       │   ├── [id]/
            │       │   │   ├── page.tsx
            │       │   │   └── edit/
            │       │   │       └── page.tsx
            │       │   └── new/
            │       │       └── page.tsx
            │       ├── logs/
            │       │   └── page.tsx
            │       ├── payment-requests/
            │       │   └── page.tsx
            │       ├── promotions/
            │       │   └── page.tsx
            │       ├── rewards/
            │       │   └── page.tsx
            │       └── users/
            │           └── page.tsx
            ├── (auth)/
            │   ├── layout.tsx
            │   ├── forgot-password/
            │   │   └── page.tsx
            │   ├── login/
            │   │   └── page.tsx
            │   ├── register/
            │   │   └── page.tsx
            │   └── reset-password/
            │       └── page.tsx
            ├── (dashboard)/
            │   ├── layout.tsx
            │   ├── dashboard/
            │   │   └── page.tsx
            │   ├── games/
            │   │   ├── page.tsx
            │   │   └── [id]/
            │   │       └── page.tsx
            │   ├── history/
            │   │   └── page.tsx
            │   ├── payment-request/
            │   │   └── page.tsx
            │   ├── profile/
            │   │   ├── page.tsx
            │   │   ├── change-password/
            │   │   │   └── page.tsx
            │   │   └── preferences/
            │   │       └── page.tsx
            │   ├── promotions/
            │   │   └── page.tsx
            │   ├── rewards/
            │   │   └── page.tsx
            │   └── statistics/
            │       └── page.tsx
            └── api/
                ├── admin/
                │   ├── dashboard-summary/
                │   │   └── route.ts
                │   ├── games/
                │   │   ├── route.ts
                │   │   └── [id]/
                │   │       └── route.ts
                │   ├── payment-requests/
                │   │   ├── route.ts
                │   │   └── [id]/
                │   │       └── route.ts
                │   ├── rewards/
                │   │   └── route.ts
                │   └── users/
                │       └── route.ts
                ├── auth/
                │   ├── change-password/
                │   │   └── route.ts
                │   ├── login/
                │   │   └── route.ts
                │   ├── phone-login/
                │   │   └── route.ts
                │   ├── register/
                │   │   └── route.ts
                │   ├── resend-verification/
                │   │   └── route.ts
                │   ├── reset-password/
                │   │   └── route.ts
                │   ├── update-user/
                │   │   └── route.ts
                │   └── verify-email/
                │       └── route.ts
                ├── game-rounds/
                │   ├── route.ts
                │   ├── [id]/
                │   │   ├── route.ts
                │   │   ├── bets/
                │   │   │   └── route.ts
                │   │   ├── complete/
                │   │   │   └── route.ts
                │   │   ├── number-distribution/
                │   │   │   └── route.ts
                │   │   └── results/
                │   │       └── route.ts
                │   └── bets/
                │       └── route.ts
                ├── history/
                │   └── route.ts
                ├── notifications/
                │   └── route.ts
                ├── payment-requests/
                │   ├── route.ts
                │   └── [id]/
                │       └── route.ts
                ├── profile/
                │   ├── route.ts
                │   ├── avatar/
                │   │   └── route.ts
                │   └── level-progress/
                │       └── route.ts
                ├── rewards/
                │   ├── route.ts
                │   └── [code]/
                │       ├── route.ts
                │       └── redeem/
                │           └── route.ts
                ├── statistics/
                │   ├── activities/
                │   │   └── route.ts
                │   ├── level-benefits/
                │   │   └── route.ts
                │   └── user/
                │       └── route.ts
                └── upload/
                    └── route.ts

# Bảng mô tả chi tiết chức năng của ứng dụng Game Cá Cược

## 1. Layouts

| Layout | Đường dẫn | Chức năng |
|--------|-----------|-----------|
| Root Layout | `/src/app/layout.tsx` | Layout chính của toàn bộ ứng dụng, cung cấp các providers thiết yếu như QueryProvider, AuthProvider, NotificationProvider và ToastProvider |
| Admin Layout | `/src/app/(admin)/admin/layout.tsx` | Layout dành cho khu vực quản trị, kiểm tra quyền admin, redirect nếu không có quyền, hiển thị AdminSidebar |
| Auth Layout | `/src/app/(auth)/layout.tsx` | Layout cho các trang xác thực (đăng nhập, đăng ký), kiểm tra session và redirect về dashboard nếu đã đăng nhập |
| Dashboard Layout | `/src/app/(dashboard)/layout.tsx` | Layout cho khu vực người dùng đã đăng nhập, bao gồm Navbar và Footer, kiểm tra session, redirect nếu chưa đăng nhập |

## 2. Pages

### Trang chính

| Page | Đường dẫn | Chức năng |
|------|-----------|-----------|
| Home | `/src/app/page.tsx` | Trang chủ, hiển thị landing page với giới thiệu về nền tảng cá cược, các tính năng nổi bật và kêu gọi đăng ký/đăng nhập |

### Admin Pages

| Page | Đường dẫn | Chức năng |
|------|-----------|-----------|
| Admin Dashboard | `/src/app/(admin)/admin/dashboard/page.tsx` | Trang tổng quan dành cho admin, hiển thị các số liệu quan trọng của hệ thống |
| Admin Games | `/src/app/(admin)/admin/games/page.tsx` | Quản lý danh sách các lượt chơi trong hệ thống, hỗ trợ phân trang |
| Admin Game Detail | `/src/app/(admin)/admin/games/[id]/page.tsx` | Xem chi tiết một lượt chơi cụ thể và danh sách cược của người chơi |
| Admin Game Edit | `/src/app/(admin)/admin/games/[id]/edit/page.tsx` | Chỉnh sửa thông tin lượt chơi, chỉ cho phép sửa khi trạng thái là pending |
| Admin Game New | `/src/app/(admin)/admin/games/new/page.tsx` | Tạo lượt chơi mới trong hệ thống |

### Auth Pages

| Page | Đường dẫn | Chức năng |
|------|-----------|-----------|
| Login | `/src/app/(auth)/login/page.tsx` | Trang đăng nhập vào hệ thống với form đăng nhập |
| Register | `/src/app/(auth)/register/page.tsx` | Trang đăng ký tài khoản mới, hỗ trợ mã giới thiệu |
| Forgot Password | `/src/app/(auth)/forgot-password/page.tsx` | Trang yêu cầu đặt lại mật khẩu qua email |
| Reset Password | `/src/app/(auth)/reset-password/page.tsx` | Trang đặt mật khẩu mới sau khi xác nhận link reset password |

### Dashboard Pages

| Page | Đường dẫn | Chức năng |
|------|-----------|-----------|
| User Dashboard | `/src/app/(dashboard)/dashboard/page.tsx` | Trang tổng quan người dùng, hiển thị thông tin cá nhân và số liệu tóm tắt |
| Games List | `/src/app/(dashboard)/games/page.tsx` | Danh sách các lượt chơi đang diễn ra, hỗ trợ phân trang |
| Game Detail | `/src/app/(dashboard)/games/[id]/page.tsx` | Chi tiết lượt chơi và giao diện đặt cược, xem danh sách người đặt cược |
| History | `/src/app/(dashboard)/history/page.tsx` | Lịch sử đặt cược và thanh toán của người dùng |
| Payment Request | `/src/app/(dashboard)/payment-request/page.tsx` | Form yêu cầu nạp tiền vào tài khoản |
| Profile | `/src/app/(dashboard)/profile/page.tsx` | Quản lý thông tin hồ sơ cá nhân, thống kê và tiến trình cấp độ |
| Change Password | `/src/app/(dashboard)/profile/change-password/page.tsx` | Form thay đổi mật khẩu tài khoản |
| Preferences | `/src/app/(dashboard)/profile/preferences/page.tsx` | Cài đặt tùy chọn và thiết lập tài khoản |
| Rewards | `/src/app/(dashboard)/rewards/page.tsx` | Quản lý phần thưởng và mã thưởng của người dùng |
| Statistics | `/src/app/(dashboard)/statistics/page.tsx` | Xem thống kê chi tiết và cấp độ người dùng |

## 3. API Endpoints

### Admin APIs

| API Endpoint | HTTP Method | Đường dẫn | Chức năng |
|--------------|-------------|-----------|-----------|
| Dashboard Summary | GET | `/api/admin/dashboard-summary` | Lấy số liệu tổng quan hệ thống cho admin (tổng người dùng, lượt chơi, doanh thu...) |
| Games List | GET | `/api/admin/games` | Lấy danh sách lượt chơi với quyền admin, hỗ trợ lọc theo trạng thái, phân trang |
| Create Game | POST | `/api/admin/games` | Tạo lượt chơi mới với quyền admin |
| Game Detail | GET | `/api/admin/games/[id]` | Lấy chi tiết lượt chơi cụ thể với quyền admin |
| Update Game | PATCH | `/api/admin/games/[id]` | Cập nhật thông tin lượt chơi với quyền admin |
| Delete Game | DELETE | `/api/admin/games/[id]` | Xóa lượt chơi với quyền admin (chỉ xóa được lượt chơi pending) |
| Rewards List | GET | `/api/admin/rewards` | Quản lý phần thưởng trong hệ thống với quyền admin |
| Create Reward | POST | `/api/admin/rewards` | Tạo phần thưởng mới cho người dùng với quyền admin |

### Auth APIs

| API Endpoint | HTTP Method | Đường dẫn | Chức năng |
|--------------|-------------|-----------|-----------|
| Login | POST | `/api/auth/login` | Đăng nhập bằng email và mật khẩu, cập nhật last_login |
| Phone Login | POST | `/api/auth/phone-login` | Đăng nhập bằng số điện thoại và mật khẩu |
| Register | POST | `/api/auth/register` | Đăng ký tài khoản mới, hỗ trợ thêm mã giới thiệu |
| Change Password | POST | `/api/auth/change-password` | Thay đổi mật khẩu người dùng (yêu cầu xác thực mật khẩu cũ) |
| Reset Password | POST | `/api/auth/reset-password` | Gửi email yêu cầu đặt lại mật khẩu |
| Resend Verification | POST | `/api/auth/resend-verification` | Gửi lại email xác minh tài khoản |
| Verify Email | POST | `/api/auth/verify-email` | Xác minh email người dùng thông qua token |
| Update User | POST | `/api/auth/update-user` | Cập nhật thông tin người dùng như display_name, email, phone |

### Game APIs

| API Endpoint | HTTP Method | Đường dẫn | Chức năng |
|--------------|-------------|-----------|-----------|
| Game Rounds | GET | `/api/game-rounds` | Lấy danh sách lượt chơi, hỗ trợ lọc theo trạng thái và phân trang |
| Game Detail | GET | `/api/game-rounds/[id]` | Lấy chi tiết lượt chơi, danh sách cược, và cược của người dùng hiện tại |
| Complete Game | POST | `/api/game-rounds/[id]/complete` | Hoàn thành lượt chơi và xử lý kết quả với số trúng (admin only) |
| Number Distribution | GET | `/api/game-rounds/[id]/number-distribution` | Lấy phân phối số lượng đặt cược trong lượt chơi |
| Game Results | GET | `/api/game-rounds/[id]/results` | Lấy kết quả của lượt chơi sau khi đã hoàn thành |
| Place Bet | POST | `/api/game-rounds/bets` | Đặt cược vào lượt chơi với số được chọn và số tiền |

### Profile APIs

| API Endpoint | HTTP Method | Đường dẫn | Chức năng |
|--------------|-------------|-----------|-----------|
| Get Profile | GET | `/api/profile` | Lấy thông tin profile người dùng |
| Update Profile | PUT | `/api/profile` | Cập nhật thông tin profile người dùng |
| Upload Avatar | POST | `/api/profile/avatar` | Tải lên ảnh đại diện mới |
| Delete Avatar | DELETE | `/api/profile/avatar` | Xóa ảnh đại diện hiện tại |
| Level Progress | GET | `/api/profile/level-progress` | Lấy tiến trình cấp độ và kinh nghiệm người dùng |

### Misc APIs

| API Endpoint | HTTP Method | Đường dẫn | Chức năng |
|--------------|-------------|-----------|-----------|
| History | GET | `/api/history` | Lấy lịch sử đặt cược và thanh toán, hỗ trợ lọc theo loại và phân trang |
| Get Notifications | GET | `/api/notifications` | Lấy danh sách thông báo của người dùng |
| Create Notification | POST | `/api/notifications` | Tạo thông báo mới (chỉ dành cho admin) |
| Payment Requests | GET | `/api/payment-requests` | Lấy danh sách yêu cầu thanh toán |
| Create Payment Request | POST | `/api/payment-requests` | Tạo yêu cầu nạp tiền mới |
| Payment Request Detail | GET | `/api/payment-requests/[id]` | Lấy chi tiết yêu cầu thanh toán |
| Update Payment Request | PUT | `/api/payment-requests/[id]` | Cập nhật/duyệt yêu cầu thanh toán |
| Delete Payment Request | DELETE | `/api/payment-requests/[id]` | Xóa yêu cầu thanh toán |
| User Rewards | GET | `/api/rewards` | Lấy danh sách phần thưởng của người dùng |
| Reward Detail | GET | `/api/rewards/[code]` | Lấy chi tiết phần thưởng theo mã |
| Redeem Reward | POST | `/api/rewards/[code]/redeem` | Đổi phần thưởng thành tiền trong tài khoản |
| User Activities | GET | `/api/statistics/activities` | Lấy thống kê hoạt động gần đây của người dùng |
| Level Benefits | GET | `/api/statistics/level-benefits` | Lấy thông tin phúc lợi theo cấp độ người dùng |
| User Statistics | GET | `/api/statistics/user` | Lấy thống kê cá nhân người dùng |
| File Upload | POST | `/api/upload` | API tải lên file hình ảnh (hỗ trợ avatar, bằng chứng thanh toán) |

Bảng mô tả này cung cấp cái nhìn tổng quan về toàn bộ chức năng của ứng dụng, từ layout, pages đến API endpoints. Đây là một ứng dụng cá cược trực tuyến với đầy đủ các chức năng quản lý người dùng, quản lý lượt chơi, đặt cược, thanh toán và hệ thống cấp độ người dùng.