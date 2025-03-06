Directory structure:
└── dominicushuy-bets-nextjs/
    ├── README.md
    ├── create-nextjs-structure.sh
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.mjs
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── public/
    └── src/
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── (admin)/
        │   │   └── admin/
        │   │       ├── layout.tsx
        │   │       ├── dashboard/
        │   │       │   └── page.tsx
        │   │       ├── games/
        │   │       │   ├── page.tsx
        │   │       │   ├── [id]/
        │   │       │   │   ├── page.tsx
        │   │       │   │   └── edit/
        │   │       │   │       └── page.tsx
        │   │       │   └── new/
        │   │       │       └── page.tsx
        │   │       ├── logs/
        │   │       │   └── page.tsx
        │   │       ├── payment-requests/
        │   │       │   └── page.tsx
        │   │       ├── promotions/
        │   │       │   └── page.tsx
        │   │       ├── rewards/
        │   │       │   └── page.tsx
        │   │       └── users/
        │   │           └── page.tsx
        │   ├── (auth)/
        │   │   ├── layout.tsx
        │   │   ├── forgot-password/
        │   │   │   └── page.tsx
        │   │   ├── login/
        │   │   │   └── page.tsx
        │   │   ├── register/
        │   │   │   └── page.tsx
        │   │   └── reset-password/
        │   │       └── page.tsx
        │   ├── (dashboard)/
        │   │   ├── layout.tsx
        │   │   ├── dashboard/
        │   │   │   └── page.tsx
        │   │   ├── games/
        │   │   │   ├── page.tsx
        │   │   │   └── [id]/
        │   │   │       └── page.tsx
        │   │   ├── history/
        │   │   │   └── page.tsx
        │   │   ├── payment-request/
        │   │   │   └── page.tsx
        │   │   ├── profile/
        │   │   │   ├── page.tsx
        │   │   │   ├── change-password/
        │   │   │   │   └── page.tsx
        │   │   │   └── preferences/
        │   │   │       └── page.tsx
        │   │   ├── promotions/
        │   │   │   └── page.tsx
        │   │   └── rewards/
        │   │       └── page.tsx
        │   └── api/
        │       ├── admin/
        │       │   ├── dashboard-summary/
        │       │   │   └── route.ts
        │       │   ├── games/
        │       │   │   ├── route.ts
        │       │   │   └── [id]/
        │       │   │       └── route.ts
        │       │   ├── payment-requests/
        │       │   │   ├── route.ts
        │       │   │   └── [id]/
        │       │   │       └── route.ts
        │       │   ├── rewards/
        │       │   │   └── route.ts
        │       │   └── users/
        │       │       └── route.ts
        │       ├── auth/
        │       │   ├── change-password/
        │       │   │   └── route.ts
        │       │   ├── login/
        │       │   │   └── route.ts
        │       │   ├── register/
        │       │   │   └── route.ts
        │       │   ├── resend-verification/
        │       │   │   └── route.ts
        │       │   ├── reset-password/
        │       │   │   └── route.ts
        │       │   ├── update-user/
        │       │   │   └── route.ts
        │       │   └── verify-email/
        │       │       └── route.ts
        │       ├── game-rounds/
        │       │   ├── route.ts
        │       │   ├── [id]/
        │       │   │   ├── route.ts
        │       │   │   ├── bets/
        │       │   │   │   └── route.ts
        │       │   │   ├── complete/
        │       │   │   │   └── route.ts
        │       │   │   ├── number-distribution/
        │       │   │   │   └── route.ts
        │       │   │   └── results/
        │       │   │       └── route.ts
        │       │   └── bets/
        │       │       └── route.ts
        │       ├── history/
        │       │   └── route.ts
        │       ├── notifications/
        │       │   └── route.ts
        │       ├── payment-requests/
        │       │   ├── route.ts
        │       │   └── [id]/
        │       │       └── route.ts
        │       ├── profile/
        │       │   ├── route.ts
        │       │   └── level-progress/
        │       │       └── route.ts
        │       ├── rewards/
        │       │   ├── route.ts
        │       │   └── [code]/
        │       │       ├── route.ts
        │       │       └── redeem/
        │       │           └── route.ts
        │       ├── statistics/
        │       │   └── user/
        │       │       └── route.ts
        │       └── upload/
        │           └── route.ts
        ├── components/
        │   ├── admin/
        │   │   ├── admin-header.tsx
        │   │   ├── admin/
        │   │   │   ├── admin-dashboard-content.tsx
        │   │   │   └── admin-sidebar.tsx
        │   │   ├── games/
        │   │   │   ├── admin-game-control.tsx
        │   │   │   ├── admin-game-detail.tsx
        │   │   │   ├── admin-game-form.tsx
        │   │   │   ├── admin-game-list.tsx
        │   │   │   └── admin-games-content.tsx
        │   │   ├── payment-requests/
        │   │   │   ├── payment-request-approval.tsx
        │   │   │   └── payment-request-list.tsx
        │   │   └── users/
        │   │       ├── user-form.tsx
        │   │       └── user-list.tsx
        │   ├── auth/
        │   │   ├── change-password-form.tsx
        │   │   ├── forgot-password-form.tsx
        │   │   ├── login-form.tsx
        │   │   └── register-form.tsx
        │   ├── dashboard/
        │   │   ├── activity-feed.tsx
        │   │   ├── dashboard-content.tsx
        │   │   ├── featured-games.tsx
        │   │   ├── statistics-charts.tsx
        │   │   └── statistics-widget.tsx
        │   ├── game/
        │   │   ├── bet-form.tsx
        │   │   ├── bet-list.tsx
        │   │   ├── bet-success-dialog.tsx
        │   │   ├── confetti-effect.ts
        │   │   ├── game-activity.tsx
        │   │   ├── game-card.tsx
        │   │   ├── game-countdown.tsx
        │   │   ├── game-detail-skeleton.tsx
        │   │   ├── game-detail.tsx
        │   │   ├── game-list-skeleton.tsx
        │   │   ├── game-list.tsx
        │   │   ├── game-result-banner.tsx
        │   │   ├── game-result-detail.tsx
        │   │   ├── game-result-stats.tsx
        │   │   ├── game-reward-card.tsx
        │   │   ├── game-status-checker.tsx
        │   │   └── winner-animation.tsx
        │   ├── history/
        │   │   └── history-content.tsx
        │   ├── layouts/
        │   │   ├── footer.tsx
        │   │   └── main-layout.tsx
        │   ├── notifications/
        │   │   ├── notification-dropdown.tsx
        │   │   └── notification-helper.ts
        │   ├── payment/
        │   │   ├── payment-request-form.tsx
        │   │   └── upload-proof.tsx
        │   ├── profile/
        │   │   ├── preferences-form.tsx
        │   │   ├── profile-form.tsx
        │   │   └── statistics-card.tsx
        │   ├── rewards/
        │   │   ├── reward-card.tsx
        │   │   ├── reward-detail-dialog.tsx
        │   │   ├── reward-qr.tsx
        │   │   └── rewards-content.tsx
        │   └── ui/
        │       ├── accordion.tsx
        │       ├── alert.tsx
        │       ├── avatar.tsx
        │       ├── badge.tsx
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── checkbox.tsx
        │       ├── dialog.tsx
        │       ├── dropdown.tsx
        │       ├── form.tsx
        │       ├── input.tsx
        │       ├── loading.tsx
        │       ├── notification.tsx
        │       ├── pagination.tsx
        │       ├── radio-group.tsx
        │       ├── select.tsx
        │       ├── skeleton.tsx
        │       ├── switch.tsx
        │       ├── tabs.tsx
        │       └── textarea.tsx
        ├── hooks/
        │   ├── auth-hooks.ts
        │   ├── game-hooks.ts
        │   ├── history-hooks.ts
        │   ├── notification-hooks.ts
        │   ├── payment-hooks.ts
        │   ├── profile-hooks.ts
        │   ├── promotion-hooks.ts
        │   ├── reward-hooks.ts
        │   └── use-click-outside.ts
        ├── lib/
        │   ├── utils.ts
        │   └── supabase/
        │       ├── admin.ts
        │       ├── client.ts
        │       ├── server.ts
        │       └── storage.ts
        ├── providers/
        │   ├── auth-provider.tsx
        │   ├── notification-provider.tsx
        │   ├── query-provider.tsx
        │   └── toast-provider.tsx
        ├── services/
        │   ├── auth-service.ts
        │   ├── game-service.ts
        │   ├── notification-service.ts
        │   ├── payment-service.ts
        │   ├── profile-service.ts
        │   ├── promotion-service.ts
        │   └── reward-service.ts
        ├── styles/
        │   └── globals.css
        └── types/
            ├── database.ts
            └── supabase.ts

# Thư viện sử dụng trong dự án:
```json
{
  "name": "bets-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 4321",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db-type": "supabase gen types typescript --project-id eubjzigperafsrdzivvv > src/types/supabase.ts"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.1",
    "@tanstack/react-query": "^5.67.1",
    "@tanstack/react-query-devtools": "^5.67.1",
    "@types/qrcode": "^1.5.5",
    "@types/recharts": "^1.8.29",
    "autoprefixer": "10.4.16",
    "canvas-confetti": "^1.9.3",
    "clsx": "^2.1.1",
    "lucide-react": "^0.477.0",
    "next": "^14.1.0",
    "postcss": "8.4.31",
    "qrcode": "^1.5.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.5.2",
    "react-qr-code": "^2.0.15",
    "recharts": "^2.15.1",
    "sharp": "^0.33.5",
    "tailwind-merge": "^3.0.2",
    "tailwindcss": "3.3.3",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^11.1.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^20",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^10.0.0",
    "eslint": "^9",
    "eslint-config-next": "15.2.1",
    "typescript": "^5"
  }
}
```

# Mô tả chi tiết chức năng các file quan trọng trong dự án NextJS

## 1. Cấu hình và Files Cốt lõi

| File | Chức năng |
|------|-----------|
| `next.config.mjs` | Cấu hình NextJS, định nghĩa các thiết lập như redirects, rewrites, và các optimization settings |
| `middleware.ts` | Xử lý authentication flow, kiểm tra phiên đăng nhập và điều hướng người dùng giữa các routes dựa trên quyền truy cập |
| `package.json` | Quản lý dependencies và scripts của dự án |

## 2. Cấu trúc App và Layouts

| File | Chức năng |
|------|-----------|
| `src/app/layout.tsx` | Root layout bao gồm các providers chính và cấu trúc HTML chung |
| `src/app/page.tsx` | Trang chủ hiển thị giới thiệu về hệ thống cá cược |
| `src/app/(admin)/admin/layout.tsx` | Layout chung cho khu vực admin, bao gồm sidebar và header |
| `src/app/(auth)/layout.tsx` | Layout dành cho các trang authentication (login, register) |
| `src/app/(dashboard)/layout.tsx` | Layout chung cho khu vực người dùng đã đăng nhập |

## 3. Các trang chính (Pages)

### Admin Area
| File | Chức năng |
|------|-----------|
| `src/app/(admin)/admin/dashboard/page.tsx` | Dashboard quản trị, hiển thị tổng quan về số liệu hệ thống |
| `src/app/(admin)/admin/games/page.tsx` | Quản lý danh sách trò chơi trong hệ thống |
| `src/app/(admin)/admin/games/[id]/page.tsx` | Chi tiết và quản lý một trò chơi cụ thể |
| `src/app/(admin)/admin/games/[id]/edit/page.tsx` | Form chỉnh sửa thông tin trò chơi |
| `src/app/(admin)/admin/payment-requests/page.tsx` | Quản lý các yêu cầu thanh toán từ người dùng |
| `src/app/(admin)/admin/users/page.tsx` | Quản lý danh sách người dùng trong hệ thống |

### Auth Pages
| File | Chức năng |
|------|-----------|
| `src/app/(auth)/login/page.tsx` | Trang đăng nhập người dùng |
| `src/app/(auth)/register/page.tsx` | Trang đăng ký tài khoản mới |
| `src/app/(auth)/forgot-password/page.tsx` | Form yêu cầu khôi phục mật khẩu |
| `src/app/(auth)/reset-password/page.tsx` | Form đặt lại mật khẩu mới |

### User Dashboard
| File | Chức năng |
|------|-----------|
| `src/app/(dashboard)/dashboard/page.tsx` | Dashboard người dùng, hiển thị thông tin tổng quan và trò chơi nổi bật |
| `src/app/(dashboard)/games/page.tsx` | Danh sách các trò chơi có sẵn cho người dùng |
| `src/app/(dashboard)/games/[id]/page.tsx` | Chi tiết một trò chơi và form đặt cược |
| `src/app/(dashboard)/history/page.tsx` | Lịch sử đặt cược và giao dịch của người dùng |
| `src/app/(dashboard)/payment-request/page.tsx` | Gửi yêu cầu nạp/rút tiền |
| `src/app/(dashboard)/profile/page.tsx` | Thông tin và chỉnh sửa hồ sơ cá nhân |
| `src/app/(dashboard)/rewards/page.tsx` | Quản lý và đổi phần thưởng từ điểm thưởng |

## 4. API Endpoints chính

### Authentication
| File | Chức năng |
|------|-----------|
| `src/app/api/auth/login/route.ts` | Xử lý đăng nhập và cấp JWT token |
| `src/app/api/auth/register/route.ts` | Xử lý đăng ký tài khoản mới |
| `src/app/api/auth/verify-email/route.ts` | Xác thực email người dùng |
| `src/app/api/auth/reset-password/route.ts` | Xử lý yêu cầu đặt lại mật khẩu |
| `src/app/api/auth/update-user/route.ts` | Cập nhật thông tin người dùng |

### Game Management
| File | Chức năng |
|------|-----------|
| `src/app/api/admin/games/route.ts` | CRUD API cho quản lý trò chơi (admin) |
| `src/app/api/game-rounds/route.ts` | Quản lý các vòng chơi |
| `src/app/api/game-rounds/[id]/bets/route.ts` | Quản lý các lượt đặt cược trong một vòng chơi |
| `src/app/api/game-rounds/[id]/complete/route.ts` | Hoàn thành vòng chơi và tính toán kết quả |
| `src/app/api/game-rounds/[id]/results/route.ts` | Truy vấn kết quả của một vòng chơi |

### User & Payment Management
| File | Chức năng |
|------|-----------|
| `src/app/api/admin/users/route.ts` | Quản lý người dùng (admin) |
| `src/app/api/admin/payment-requests/route.ts` | Quản lý yêu cầu thanh toán (admin) |
| `src/app/api/payment-requests/route.ts` | Gửi và theo dõi yêu cầu thanh toán (user) |
| `src/app/api/history/route.ts` | Lấy lịch sử cá cược và giao dịch |
| `src/app/api/profile/route.ts` | Quản lý thông tin cá nhân |
| `src/app/api/profile/level-progress/route.ts` | Theo dõi tiến trình cấp độ người dùng |

### Rewards & Promotions
| File | Chức năng |
|------|-----------|
| `src/app/api/rewards/route.ts` | Quản lý phần thưởng và đổi điểm |
| `src/app/api/rewards/[code]/redeem/route.ts` | Đổi mã khuyến mãi |

## 5. Components chính

### Admin Components
| File | Chức năng |
|------|-----------|
| `src/components/admin/admin-header.tsx` | Header của khu vực admin |
| `src/components/admin/admin/admin-dashboard-content.tsx` | Nội dung chính của dashboard admin |
| `src/components/admin/admin/admin-sidebar.tsx` | Thanh điều hướng bên của khu vực admin |
| `src/components/admin/games/admin-game-form.tsx` | Form thêm/sửa thông tin trò chơi |
| `src/components/admin/payment-requests/payment-request-approval.tsx` | Component xử lý phê duyệt yêu cầu thanh toán |
| `src/components/admin/users/user-list.tsx` | Hiển thị danh sách người dùng với các tùy chọn quản lý |

### Authentication Components
| File | Chức năng |
|------|-----------|
| `src/components/auth/login-form.tsx` | Form đăng nhập với validation |
| `src/components/auth/register-form.tsx` | Form đăng ký với validation |
| `src/components/auth/forgot-password-form.tsx` | Form yêu cầu reset password |

### Game Components
| File | Chức năng |
|------|-----------|
| `src/components/game/bet-form.tsx` | Form đặt cược trong trò chơi |
| `src/components/game/game-card.tsx` | Card hiển thị thông tin tóm tắt về một trò chơi |
| `src/components/game/game-detail.tsx` | Chi tiết trò chơi bao gồm luật chơi, tỷ lệ cược |
| `src/components/game/game-countdown.tsx` | Hiển thị đếm ngược thời gian của vòng chơi |
| `src/components/game/game-result-banner.tsx` | Hiển thị kết quả vòng chơi sau khi hoàn thành |
| `src/components/game/winner-animation.tsx` | Hiệu ứng animation khi người dùng thắng cược |

### Dashboard Components
| File | Chức năng |
|------|-----------|
| `src/components/dashboard/dashboard-content.tsx` | Nội dung chính của dashboard người dùng |
| `src/components/dashboard/featured-games.tsx` | Hiển thị trò chơi nổi bật trên dashboard |
| `src/components/dashboard/statistics-charts.tsx` | Biểu đồ thống kê hoạt động của người dùng |
| `src/components/dashboard/activity-feed.tsx` | Feed hoạt động gần đây của người dùng |

### Other Key Components
| File | Chức năng |
|------|-----------|
| `src/components/payment/payment-request-form.tsx` | Form yêu cầu nạp/rút tiền |
| `src/components/payment/upload-proof.tsx` | Upload ảnh chứng minh thanh toán |
| `src/components/profile/profile-form.tsx` | Form cập nhật thông tin cá nhân |
| `src/components/notifications/notification-dropdown.tsx` | Dropdown hiển thị thông báo của người dùng |
| `src/components/rewards/reward-card.tsx` | Card hiển thị phần thưởng có thể đổi |

## 6. Hooks & Services

### Hooks
| File | Chức năng |
|------|-----------|
| `src/hooks/auth-hooks.ts` | Custom hooks quản lý authentication state |
| `src/hooks/game-hooks.ts` | Hooks xử lý trò chơi và đặt cược |
| `src/hooks/notification-hooks.ts` | Hooks quản lý notifications |
| `src/hooks/payment-hooks.ts` | Hooks xử lý các thao tác thanh toán |
| `src/hooks/profile-hooks.ts` | Hooks quản lý thông tin người dùng |

### Services
| File | Chức năng |
|------|-----------|
| `src/services/auth-service.ts` | Xử lý các API calls liên quan đến authentication |
| `src/services/game-service.ts` | Xử lý các API calls liên quan đến trò chơi và đặt cược |
| `src/services/payment-service.ts` | Xử lý các API calls liên quan đến thanh toán |
| `src/services/notification-service.ts` | Xử lý notifications và real-time alerts |
| `src/services/profile-service.ts` | Xử lý các API calls liên quan đến hồ sơ người dùng |

## 7. Providers

| File | Chức năng |
|------|-----------|
| `src/providers/auth-provider.tsx` | Context provider quản lý authentication state toàn cục |
| `src/providers/notification-provider.tsx` | Context provider quản lý notifications |
| `src/providers/query-provider.tsx` | Provider cho React Query, quản lý data fetching |
| `src/providers/toast-provider.tsx` | Provider cho hiển thị toast messages |

## 8. Lib & Utils

| File | Chức năng |
|------|-----------|
| `src/lib/utils.ts` | Các hàm tiện ích dùng chung trong dự án |
| `src/lib/supabase/client.ts` | Client-side Supabase client |
| `src/lib/supabase/server.ts` | Server-side Supabase client với authentication |
| `src/lib/supabase/admin.ts` | Admin Supabase client với quyền truy cập đặc biệt |
| `src/types/database.ts` | Định nghĩa TypeScript types cho database schema |

Bản mô tả này tập trung vào các file quan trọng nhất, bỏ qua các file UI cơ bản, các file trùng lặp về chức năng, và các file cấu hình ít quan trọng để làm tài liệu ngắn gọn hơn nhưng vẫn đầy đủ thông tin cần thiết.


# Mô tả chi tiết các Hooks trong hệ thống

## 1. Authentication Hooks (`src/hooks/auth-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useAuth` | Hook chính để truy cập context Auth từ AuthProvider, cung cấp phương thức truy cập user hiện tại, trạng thái đăng nhập, và các hàm đăng nhập/đăng xuất |
| `useLogin` | Quản lý quá trình đăng nhập, xử lý form submission, gọi auth-service, lưu token vào localStorage và cập nhật AuthContext |
| `useRegister` | Xử lý đăng ký người dùng mới, validate form data, gửi yêu cầu đến API và xử lý confirmation flow |
| `useLogout` | Xử lý đăng xuất, xóa token và session data, cập nhật AuthContext và điều hướng về trang login |
| `useForgotPassword` | Xử lý yêu cầu reset password, gửi email reset và hiển thị thông báo |
| `useResetPassword` | Xử lý việc đặt mật khẩu mới sau khi nhận được link reset |
| `useVerifyEmail` | Xác thực email người dùng từ token được gửi qua email verification |
| `useChangePassword` | Cho phép người dùng đổi mật khẩu khi đã đăng nhập, bao gồm validation mật khẩu cũ |

## 2. Game Hooks (`src/hooks/game-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useGames` | Fetch danh sách trò chơi có sẵn, có thể lọc theo trạng thái, loại game |
| `useGame` | Fetch và cache thông tin chi tiết của một trò chơi cụ thể theo ID |
| `useGameRounds` | Lấy danh sách các vòng chơi của một game, bao gồm cả trạng thái hiện tại |
| `useCurrentGameRound` | Lấy thông tin về vòng chơi hiện tại đang diễn ra của một game |
| `useGameRoundResults` | Lấy và cache kết quả của một vòng chơi cụ thể |
| `usePlaceBet` | Xử lý việc đặt cược vào một vòng chơi, bao gồm validation số dư, cập nhật UI và xử lý lỗi |
| `useGameStats` | Lấy thống kê của game như số người tham gia, tổng tiền cược, tỷ lệ thắng |
| `useNumberDistribution` | Phân tích phân phối các con số đã ra trong lịch sử của game (đặc biệt cho các game số) |
| `useGameCountdown` | Quản lý countdown timer cho vòng chơi hiện tại, tự động refresh khi kết thúc vòng |
| `useGameSocket` | Thiết lập kết nối real-time để nhận updates về trạng thái game, kết quả mới |

## 3. History Hooks (`src/hooks/history-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useBetHistory` | Lấy lịch sử đặt cược của người dùng với các tùy chọn filter và phân trang |
| `usePaymentHistory` | Lấy lịch sử các giao dịch nạp/rút tiền của người dùng |
| `useTransactionHistory` | Lấy toàn bộ lịch sử giao dịch bao gồm cược, thắng/thua, nạp/rút, rewards |
| `useExportHistory` | Cho phép export lịch sử giao dịch ra file CSV hoặc PDF |
| `useHistoryFilters` | Quản lý các bộ lọc áp dụng cho lịch sử (thời gian, loại giao dịch, trạng thái) |

## 4. Notification Hooks (`src/hooks/notification-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useNotifications` | Lấy và quản lý danh sách thông báo của người dùng |
| `useUnreadCount` | Lấy và theo dõi số lượng thông báo chưa đọc |
| `useMarkAsRead` | Đánh dấu một thông báo cụ thể là đã đọc |
| `useMarkAllAsRead` | Đánh dấu tất cả thông báo là đã đọc |
| `useDeleteNotification` | Xóa một thông báo cụ thể |
| `useNotificationSubscription` | Thiết lập real-time subscription để nhận thông báo mới qua WebSockets |
| `usePushNotification` | Quản lý đăng ký và hiển thị browser push notifications |

## 5. Payment Hooks (`src/hooks/payment-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useBalance` | Lấy và theo dõi số dư tài khoản của người dùng |
| `useCreatePaymentRequest` | Tạo yêu cầu nạp/rút tiền mới |
| `usePaymentRequests` | Lấy danh sách các yêu cầu thanh toán của người dùng |
| `usePaymentRequest` | Lấy chi tiết của một yêu cầu thanh toán cụ thể |
| `useCancelPaymentRequest` | Hủy một yêu cầu thanh toán chưa được xử lý |
| `useUploadPaymentProof` | Upload hình ảnh chứng minh thanh toán và liên kết với yêu cầu |
| `usePaymentMethods` | Lấy và quản lý các phương thức thanh toán đã lưu của người dùng |
| `useAdminPaymentRequests` | (Admin) Lấy tất cả yêu cầu thanh toán để quản lý |
| `useApprovePaymentRequest` | (Admin) Phê duyệt yêu cầu thanh toán và xử lý tự động |
| `useRejectPaymentRequest` | (Admin) Từ chối yêu cầu thanh toán với lý do |

## 6. Profile Hooks (`src/hooks/profile-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useProfile` | Lấy và cache thông tin profile người dùng hiện tại |
| `useUpdateProfile` | Cập nhật thông tin cá nhân của người dùng |
| `useUploadAvatar` | Upload và cập nhật avatar người dùng |
| `useProfileStats` | Lấy các thống kê về hoạt động của người dùng (tổng cược, thắng/thua) |
| `useLevelProgress` | Theo dõi tiến trình cấp độ thành viên và các đặc quyền |
| `usePreferences` | Quản lý tùy chọn cá nhân (thông báo, giao diện, ngôn ngữ) |
| `useSavePreferences` | Lưu tùy chọn người dùng vào database |
| `useActivityLog` | Lấy nhật ký hoạt động chi tiết của tài khoản |
| `useSecuritySettings` | Quản lý các thiết lập bảo mật (2FA, phiên đăng nhập) |

## 7. Promotion Hooks (`src/hooks/promotion-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `usePromotions` | Lấy danh sách các khuyến mãi đang hoạt động |
| `usePromotion` | Lấy chi tiết một khuyến mãi cụ thể |
| `useClaimPromotion` | Nhận một khuyến mãi cho tài khoản |
| `usePromotionStatus` | Kiểm tra trạng thái đã nhận của các khuyến mãi |
| `useActivePromotions` | Lấy danh sách khuyến mãi đang hoạt động trên tài khoản người dùng |
| `usePromotionProgress` | Theo dõi tiến trình hoàn thành điều kiện của khuyến mãi |
| `useCreatePromotion` | (Admin) Tạo khuyến mãi mới |
| `useUpdatePromotion` | (Admin) Cập nhật thông tin khuyến mãi |
| `useDeletePromotion` | (Admin) Xóa khuyến mãi |

## 8. Reward Hooks (`src/hooks/reward-hooks.ts`)

| Hook | Chức năng |
|------|-----------|
| `useRewards` | Lấy danh sách các phần thưởng có thể đổi |
| `useReward` | Lấy chi tiết một phần thưởng cụ thể |
| `useRedeemReward` | Đổi điểm thưởng lấy một phần thưởng |
| `useRewardHistory` | Lấy lịch sử đổi thưởng của người dùng |
| `useRewardPoints` | Lấy và theo dõi số điểm thưởng hiện có của người dùng |
| `useRedeemCode` | Nhập và xác thực mã code để nhận thưởng |
| `useCreateReward` | (Admin) Tạo phần thưởng mới |
| `useUpdateReward` | (Admin) Cập nhật thông tin phần thưởng |
| `useDeleteReward` | (Admin) Xóa phần thưởng |
| `useRewardStatistics` | (Admin) Xem thống kê về việc đổi thưởng |

## 9. Utility Hooks (`src/hooks/use-click-outside.ts`)

| Hook | Chức năng |
|------|-----------|
| `useClickOutside` | Hook phát hiện click bên ngoài một element, thường dùng cho dropdown, modal |
| `useMediaQuery` | Theo dõi media queries để phản hồi responsive |
| `useLocalStorage` | Wrapper cho localStorage với type safety |
| `useDebounce` | Debounce một giá trị hoặc hàm để tránh gọi quá nhiều lần |
| `useThrottle` | Throttle một hàm để giới hạn tần suất gọi |

# Mô tả chi tiết các API Routes

## 1. Authentication API Routes

| API Route | Phương thức | Chức năng |
|-----------|------------|-----------|
| `/api/auth/login/route.ts` | POST | Xác thực thông tin đăng nhập, tạo JWT token và session |
| `/api/auth/register/route.ts` | POST | Đăng ký người dùng mới, hash password, gửi email xác thực |
| `/api/auth/verify-email/route.ts` | GET | Xác minh email từ verification token, cập nhật trạng thái tài khoản |
| `/api/auth/resend-verification/route.ts` | POST | Gửi lại email xác minh khi cần |
| `/api/auth/change-password/route.ts` | POST | Đổi mật khẩu khi đã đăng nhập, yêu cầu xác minh mật khẩu cũ |
| `/api/auth/reset-password/route.ts` | POST | Đặt lại mật khẩu thông qua token reset, không yêu cầu mật khẩu cũ |
| `/api/auth/update-user/route.ts` | PUT | Cập nhật thông tin người dùng (email, tên, số điện thoại...) |

## 2. Game Management API Routes

| API Route | Phương thức | Chức năng |
|-----------|------------|-----------|
| `/api/admin/games/route.ts` | GET, POST | Lấy danh sách trò chơi, tạo trò chơi mới (Admin) |
| `/api/admin/games/[id]/route.ts` | GET, PUT, DELETE | Chi tiết, cập nhật, xóa một trò chơi (Admin) |
| `/api/game-rounds/route.ts` | GET, POST | Lấy danh sách vòng chơi, tạo vòng chơi mới |
| `/api/game-rounds/[id]/route.ts` | GET, PUT | Chi tiết vòng chơi, cập nhật trạng thái |
| `/api/game-rounds/[id]/bets/route.ts` | GET, POST | Lấy danh sách cược, đặt cược mới |
| `/api/game-rounds/[id]/complete/route.ts` | POST | Hoàn thành vòng chơi, tính toán kết quả và phân phối tiền thưởng |
| `/api/game-rounds/[id]/results/route.ts` | GET | Lấy kết quả của vòng chơi |
| `/api/game-rounds/[id]/number-distribution/route.ts` | GET | Phân tích phân phối số của vòng chơi |
| `/api/game-rounds/bets/route.ts` | GET | Lấy lịch sử cược của người dùng hiện tại |

## 3. User & Admin API Routes

| API Route | Phương thức | Chức năng |
|-----------|------------|-----------|
| `/api/admin/users/route.ts` | GET, POST | Lấy danh sách người dùng, tạo người dùng mới (Admin) |
| `/api/admin/dashboard-summary/route.ts` | GET | Lấy dữ liệu tổng quan cho dashboard admin |
| `/api/admin/payment-requests/route.ts` | GET | Lấy danh sách yêu cầu thanh toán (Admin) |
| `/api/admin/payment-requests/[id]/route.ts` | GET, PUT | Chi tiết và xử lý yêu cầu thanh toán (Admin) |
| `/api/profile/route.ts` | GET, PUT | Lấy và cập nhật thông tin profile người dùng |
| `/api/profile/level-progress/route.ts` | GET | Lấy thông tin tiến trình cấp độ người dùng |

## 4. Payment API Routes

| API Route | Phương thức | Chức năng |
|-----------|------------|-----------|
| `/api/payment-requests/route.ts` | GET, POST | Lấy danh sách, tạo yêu cầu thanh toán mới |
| `/api/payment-requests/[id]/route.ts` | GET, PUT, DELETE | Chi tiết, cập nhật, hủy yêu cầu thanh toán |
| `/api/history/route.ts` | GET | Lấy lịch sử giao dịch của người dùng |
| `/api/upload/route.ts` | POST | Upload hình ảnh chứng từ thanh toán |

## 5. Notifications & Rewards API Routes

| API Route | Phương thức | Chức năng |
|-----------|------------|-----------|
| `/api/notifications/route.ts` | GET, PUT, DELETE | Lấy, cập nhật (đánh dấu đã đọc), xóa thông báo |
| `/api/rewards/route.ts` | GET, POST | Lấy danh sách phần thưởng, thêm phần thưởng mới (Admin) |
| `/api/rewards/[code]/route.ts` | GET | Lấy thông tin chi tiết của một phần thưởng |
| `/api/rewards/[code]/redeem/route.ts` | POST | Đổi điểm thưởng lấy phần thưởng |
| `/api/admin/rewards/route.ts` | GET, POST, PUT, DELETE | Quản lý phần thưởng (Admin) |
| `/api/statistics/user/route.ts` | GET | Lấy thống kê hoạt động của người dùng |

# Mô tả chi tiết các Services

## 1. Authentication Service (`src/services/auth-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `login(email, password)` | Gửi request đăng nhập, nhận và lưu JWT token |
| `register(userData)` | Đăng ký người dùng mới với thông tin cá nhân |
| `logout()` | Xóa token và thông tin phiên làm việc |
| `resetPassword(token, newPassword)` | Đặt lại mật khẩu với token reset |
| `changePassword(oldPassword, newPassword)` | Đổi mật khẩu khi đã đăng nhập |
| `verifyEmail(token)` | Xác minh email người dùng |
| `resendVerification(email)` | Gửi lại email xác minh |
| `forgotPassword(email)` | Yêu cầu gửi link reset password |
| `getCurrentUser()` | Lấy thông tin người dùng hiện tại từ token |
| `refreshToken()` | Refresh JWT token để duy trì phiên đăng nhập |

## 2. Game Service (`src/services/game-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `getGames(filters)` | Lấy danh sách trò chơi theo bộ lọc |
| `getGame(id)` | Lấy thông tin chi tiết một trò chơi |
| `getGameRounds(gameId, filters)` | Lấy danh sách vòng chơi của một game |
| `getCurrentRound(gameId)` | Lấy vòng chơi hiện tại đang diễn ra |
| `getResults(roundId)` | Lấy kết quả của một vòng chơi |
| `placeBet(roundId, betData)` | Đặt cược vào một vòng chơi |
| `getNumberDistribution(gameId, period)` | Lấy thống kê phân phối số trong một khoảng thời gian |
| `getBetHistory(filters)` | Lấy lịch sử đặt cược của người dùng |
| `createGame(gameData)` | (Admin) Tạo trò chơi mới |
| `updateGame(id, gameData)` | (Admin) Cập nhật thông tin trò chơi |
| `deleteGame(id)` | (Admin) Xóa trò chơi |
| `createGameRound(gameId, roundData)` | (Admin) Tạo vòng chơi mới |
| `completeRound(roundId, results)` | (Admin) Hoàn thành vòng chơi với kết quả |

## 3. Notification Service (`src/services/notification-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `getNotifications(page, limit)` | Lấy danh sách thông báo, có phân trang |
| `getUnreadCount()` | Lấy số lượng thông báo chưa đọc |
| `markAsRead(notificationId)` | Đánh dấu một thông báo là đã đọc |
| `markAllAsRead()` | Đánh dấu tất cả thông báo là đã đọc |
| `deleteNotification(notificationId)` | Xóa một thông báo |
| `subscribeToNotifications(callback)` | Đăng ký nhận thông báo real-time |
| `unsubscribeFromNotifications()` | Hủy đăng ký nhận thông báo |
| `sendNotification(userId, content)` | (Admin) Gửi thông báo đến người dùng cụ thể |
| `sendBroadcast(content, userFilters)` | (Admin) Gửi thông báo đồng loạt đến nhiều người dùng |
| `registerPushNotifications(subscription)` | Đăng ký nhận push notification trên browser |

## 4. Payment Service (`src/services/payment-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `getBalance()` | Lấy số dư hiện tại của người dùng |
| `getPaymentRequests(filters)` | Lấy danh sách yêu cầu thanh toán của người dùng |
| `getPaymentRequest(id)` | Lấy chi tiết một yêu cầu thanh toán |
| `createDepositRequest(amount, method, details)` | Tạo yêu cầu nạp tiền |
| `createWithdrawalRequest(amount, method, details)` | Tạo yêu cầu rút tiền |
| `cancelPaymentRequest(id)` | Hủy yêu cầu thanh toán |
| `uploadPaymentProof(requestId, file)` | Upload ảnh chứng minh thanh toán |
| `getPaymentMethods()` | Lấy danh sách các phương thức thanh toán đã lưu |
| `addPaymentMethod(methodData)` | Thêm phương thức thanh toán mới |
| `deletePaymentMethod(id)` | Xóa phương thức thanh toán |
| `getAllPaymentRequests(filters)` | (Admin) Lấy tất cả yêu cầu thanh toán |
| `approvePaymentRequest(id, comment)` | (Admin) Phê duyệt yêu cầu thanh toán |
| `rejectPaymentRequest(id, reason)` | (Admin) Từ chối yêu cầu thanh toán |

## 5. Profile Service (`src/services/profile-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `getProfile()` | Lấy thông tin profile người dùng |
| `updateProfile(profileData)` | Cập nhật thông tin cá nhân |
| `uploadAvatar(file)` | Upload và cập nhật avatar |
| `getProfileStats(period)` | Lấy thống kê hoạt động theo thời gian |
| `getLevelProgress()` | Lấy tiến trình cấp độ thành viên |
| `getPreferences()` | Lấy tùy chọn cá nhân |
| `savePreferences(preferences)` | Lưu tùy chọn cá nhân |
| `getActivityLog(filters)` | Lấy nhật ký hoạt động chi tiết |
| `getSecuritySettings()` | Lấy thiết lập bảo mật hiện tại |
| `updateSecuritySettings(settings)` | Cập nhật thiết lập bảo mật |
| `enable2FA()` | Bật xác thực hai yếu tố |
| `disable2FA(code)` | Tắt xác thực hai yếu tố |

## 6. Promotion Service (`src/services/promotion-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `getPromotions()` | Lấy danh sách khuyến mãi đang hoạt động |
| `getPromotion(id)` | Lấy chi tiết một khuyến mãi |
| `claimPromotion(id)` | Đăng ký nhận khuyến mãi |
| `getActivePromotions()` | Lấy danh sách khuyến mãi đang hoạt động trên tài khoản |
| `getPromotionProgress(id)` | Lấy tiến trình hoàn thành điều kiện khuyến mãi |
| `createPromotion(data)` | (Admin) Tạo khuyến mãi mới |
| `updatePromotion(id, data)` | (Admin) Cập nhật thông tin khuyến mãi |
| `deletePromotion(id)` | (Admin) Xóa khuyến mãi |
| `getPromotionStatistics(id)` | (Admin) Xem thống kê về khuyến mãi |

## 7. Reward Service (`src/services/reward-service.ts`)

| Function | Chức năng |
|----------|-----------|
| `getRewards()` | Lấy danh sách phần thưởng có thể đổi |
| `getReward(id)` | Lấy chi tiết một phần thưởng |
| `redeemReward(id)` | Đổi điểm thưởng lấy phần thưởng |
| `getRewardHistory()` | Lấy lịch sử đổi thưởng |
| `getRewardPoints()` | Lấy số điểm thưởng hiện có |
| `redeemCode(code)` | Nhập và xác thực mã code nhận thưởng |
| `createReward(data)` | (Admin) Tạo phần thưởng mới |
| `updateReward(id, data)` | (Admin) Cập nhật thông tin phần thưởng |
| `deleteReward(id)` | (Admin) Xóa phần thưởng |
| `getRewardStatistics()` | (Admin) Xem thống kê về việc đổi thưởng |

# Mô tả chi tiết các Components chính

## 1. Game Components

| Component | Props | Chức năng |
|-----------|-------|-----------|
| `BetForm` | `gameId, roundId, onSuccess` | Form đặt cược với các tùy chọn, validation số dư và xử lý đặt cược |
| `GameCard` | `game, featured` | Card hiển thị thông tin tóm tắt về trò chơi, hình ảnh và button tham gia |
| `GameDetail` | `gameId` | Chi tiết trò chơi bao gồm luật chơi, lịch sử kết quả, thống kê |
| `GameCountdown` | `endTime, onComplete` | Hiển thị đếm ngược thời gian còn lại của vòng chơi |
| `GameResultBanner` | `result, betAmount, winAmount` | Banner hiển thị kết quả và tiền thắng/thua |
| `WinnerAnimation` | `amount, type` | Hiệu ứng animation confetti khi người dùng thắng cược |
| `GameActivity` | `gameId, limit` | Feed hoạt động real-time của trò chơi (người tham gia, cược lớn) |
| `GameResultStats` | `gameId, period` | Biểu đồ thống kê kết quả, xu hướng của trò chơi |

## 2. Admin Components

| Component | Props | Chức năng |
|-----------|-------|-----------|
| `AdminHeader` | `user` | Header khu vực admin với thông tin người dùng và notifications |
| `AdminSidebar` | `activeRoute` | Thanh điều hướng bên của khu vực admin với các menu chính |
| `AdminGameForm` | `game, onSubmit` | Form thêm/sửa thông tin trò chơi với validation |
| `AdminGameControl` | `gameId` | Bảng điều khiển trò chơi (bắt đầu/kết thúc vòng, thêm kết quả) |
| `AdminGameList` | `filters, onEdit, onDelete` | Bảng danh sách trò chơi với các tính năng sort, filter |
| `PaymentRequestApproval` | `request, onApprove, onReject` | Giao diện xử lý phê duyệt yêu cầu thanh toán |
| `UserList` | `filters, onEdit, onBlock` | Bảng danh sách người dùng với tìm kiếm, filter |
| `AdminDashboardContent` | - | Dashboard hiển thị số liệu tổng quan, biểu đồ hoạt động, alert |

## 3. Authentication Components

| Component | Props | Chức năng |
|-----------|-------|-----------|
| `LoginForm` | `onSuccess, redirectUrl` | Form đăng nhập với validation, reCAPTCHA, remember me |
| `RegisterForm` | `onSuccess` | Form đăng ký với validation, điều khoản dịch vụ, verification |
| `ForgotPasswordForm` | `onSuccess` | Form yêu cầu reset mật khẩu qua email |
| `ChangePasswordForm` | `onSuccess` | Form đổi mật khẩu yêu cầu mật khẩu cũ và mới |
| `ResetPasswordForm` | `token, onSuccess` | Form đặt mật khẩu mới sau khi nhận token reset |

## 4. Dashboard Components

| Component | Props | Chức năng |
|-----------|-------|-----------|
| `DashboardContent` | `user` | Nội dung chính của dashboard người dùng |
| `FeaturedGames` | - | Carousel hiển thị các trò chơi nổi bật, đang hot |
| `StatisticsCharts` | `period, userData` | Biểu đồ thống kê hoạt động của người dùng (line, bar charts) |
| `ActivityFeed` | `limit` | Feed hoạt động gần đây của người dùng và hệ thống |
| `StatisticsWidget` | `type, data` | Widget hiển thị số liệu thống kê cụ thể với icon và biểu đồ mini |

## 5. Profile & Payment Components

| Component | Props | Chức năng |
|-----------|-------|-----------|
| `ProfileForm` | `user, onUpdate` | Form cập nhật thông tin cá nhân với validation |
| `PaymentRequestForm` | `type, onSubmit` | Form yêu cầu nạp/rút tiền với các phương thức thanh toán |
| `UploadProof` | `requestId, onUpload` | Component upload ảnh chứng minh thanh toán với preview |
| `PreferencesForm` | `preferences, onSave` | Form thiết lập tùy chọn cá nhân (thông báo, ngôn ngữ) |
| `StatisticsCard` | `title, value, change, icon` | Card hiển thị một số liệu thống kê với so sánh |

## 6. Notifications & UI Components

| Component | Props | Chức năng |
|-----------|-------|-----------|
| `NotificationDropdown` | `onMarkAsRead` | Dropdown hiển thị danh sách thông báo với badge số lượng |
| `RewardCard` | `reward, onRedeem` | Card hiển thị thông tin về phần thưởng có thể đổi |
| `RewardDetailDialog` | `reward, onRedeem` | Dialog hiển thị chi tiết phần thưởng và xác nhận đổi |
| `RewardQR` | `code, expiresAt` | Hiển thị QR code cho phần thưởng đã đổi |

Với mô tả chi tiết này, bạn có thể hiểu rõ về cách các thành phần khác nhau trong hệ thống tương tác với nhau, từ hooks quản lý trạng thái, services xử lý logic nghiệp vụ, cho đến components UI hiển thị dữ liệu và tương tác với người dùng.
