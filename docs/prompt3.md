Tôi dự định sẽ xây dựng phần tính năng sau và danh sách tất cả cấu trúc thư mục của dự án, hãy giúp tôi lấy ra những folder liên quan đến phần tính năng cần làm, Luôn luôn giữ lại những Layout, Page , Share components. 
Output tôi cần là 1 String bao gồm tên đường dẫn tất cả các files, folder, được cách nhau bởi dấu “,”. Những đường dẫn nào có chứa “(...)“ thì thay thế thành “*” (ví dụ: src/app/(dashboard)/profile/page.tsx -> src/app/*/profile/page.tsx) 

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
        │       ├── LevelBadge.tsx
        │       ├── UserLevelDetails.tsx
        │       └── UserStatsCards.tsx
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
