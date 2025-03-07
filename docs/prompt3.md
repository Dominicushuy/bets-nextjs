Tôi dự định sẽ xây dựng phần tính năng sau, dưới đây là danh sách cấu trúc thư mục của dự án, hãy giúp tôi lấy ra những folders, files liên quan đến phần tính năng cần làm, Luôn luôn giữ lại những Layout, Page , Share components.

Output tôi cần là 1 String bao gồm tên đường dẫn tất cả các files, folder, được cách nhau bởi dấu “,”. Những đường dẫn nào có chứa “(...)“ hoặc “[…]” thì thay thế thành “*” (ví dụ: src/app/(dashboard)/profile/page.tsx -> src/app/*/profile/page.tsx)

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

Directory structure:
└── dominicushuy-bets-nextjs/
    ├── README.md
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
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
        │   │   ├── rewards/
        │   │   │   └── page.tsx
        │   │   └── statistics/
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
        │       │   ├── phone-login/
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
        │       │   ├── active/
        │       │   │   └── route.ts
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
        │       │   ├── avatar/
        │       │   │   └── route.ts
        │       │   └── level-progress/
        │       │       └── route.ts
        │       ├── rewards/
        │       │   ├── route.ts
        │       │   └── [code]/
        │       │       ├── route.ts
        │       │       └── redeem/
        │       │           └── route.ts
        │       ├── statistics/
        │       │   ├── activities/
        │       │   │   └── route.ts
        │       │   ├── level-benefits/
        │       │   │   └── route.ts
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
        │   │   ├── avatar-upload.tsx
        │   │   ├── bet-history-list.tsx
        │   │   ├── preferences-form.tsx
        │   │   ├── profile-form.tsx
        │   │   ├── statistics-card.tsx
        │   │   ├── user-level-progress.tsx
        │   │   └── user-statistics.tsx
        │   ├── rewards/
        │   │   ├── reward-card.tsx
        │   │   ├── reward-detail-dialog.tsx
        │   │   ├── reward-qr.tsx
        │   │   └── rewards-content.tsx
        │   ├── statistics/
        │   │   ├── activity-feed.tsx
        │   │   ├── statistics-chart.tsx
        │   │   └── user-statistics-content.tsx
        │   ├── ui/
        │   │   ├── accordion.tsx
        │   │   ├── alert.tsx
        │   │   ├── avatar.tsx
        │   │   ├── badge.tsx
        │   │   ├── button.tsx
        │   │   ├── card.tsx
        │   │   ├── checkbox.tsx
        │   │   ├── dialog.tsx
        │   │   ├── dropdown.tsx
        │   │   ├── form.tsx
        │   │   ├── input.tsx
        │   │   ├── loading.tsx
        │   │   ├── notification.tsx
        │   │   ├── pagination.tsx
        │   │   ├── progress.tsx
        │   │   ├── radio-group.tsx
        │   │   ├── select.tsx
        │   │   ├── skeleton.tsx
        │   │   ├── switch.tsx
        │   │   ├── tabs.tsx
        │   │   └── textarea.tsx
        │   └── user/
        │       ├── level-badge.tsx
        │       ├── user-level-details.tsx
        │       └── user-stats-cards.tsx
        ├── hooks/
        │   ├── auth-hooks.ts
        │   ├── game-hooks.ts
        │   ├── history-hooks.ts
        │   ├── notification-hooks.ts
        │   ├── payment-hooks.ts
        │   ├── profile-hooks.ts
        │   ├── promotion-hooks.ts
        │   ├── reward-hooks.ts
        │   ├── statistics-hooks.ts
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
        │   ├── reward-service.ts
        │   └── statistics-service.ts
        ├── styles/
        │   └── globals.css
        └── types/
            ├── database.ts
            └── supabase.ts
