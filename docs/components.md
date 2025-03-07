Directory structure:
└── dominicushuy-bets-nextjs/
    └── src/
        └── components/
            ├── admin/
            │   ├── admin-header.tsx
            │   ├── admin/
            │   │   ├── admin-dashboard-content.tsx
            │   │   └── admin-sidebar.tsx
            │   ├── games/
            │   │   ├── admin-game-control.tsx
            │   │   ├── admin-game-detail.tsx
            │   │   ├── admin-game-form.tsx
            │   │   ├── admin-game-list.tsx
            │   │   └── admin-games-content.tsx
            │   ├── payment-requests/
            │   │   ├── payment-request-approval.tsx
            │   │   └── payment-request-list.tsx
            │   └── users/
            │       ├── user-form.tsx
            │       └── user-list.tsx
            ├── auth/
            │   ├── change-password-form.tsx
            │   ├── forgot-password-form.tsx
            │   ├── login-form.tsx
            │   └── register-form.tsx
            ├── dashboard/
            │   ├── activity-feed.tsx
            │   ├── dashboard-content.tsx
            │   ├── featured-games.tsx
            │   ├── statistics-charts.tsx
            │   └── statistics-widget.tsx
            ├── game/
            │   ├── bet-form.tsx
            │   ├── bet-list.tsx
            │   ├── bet-success-dialog.tsx
            │   ├── confetti-effect.ts
            │   ├── game-activity.tsx
            │   ├── game-card.tsx
            │   ├── game-countdown.tsx
            │   ├── game-detail-skeleton.tsx
            │   ├── game-detail.tsx
            │   ├── game-list-skeleton.tsx
            │   ├── game-list.tsx
            │   ├── game-result-banner.tsx
            │   ├── game-result-detail.tsx
            │   ├── game-result-stats.tsx
            │   ├── game-reward-card.tsx
            │   ├── game-status-checker.tsx
            │   └── winner-animation.tsx
            ├── history/
            │   └── history-content.tsx
            ├── layouts/
            │   ├── footer.tsx
            │   └── main-layout.tsx
            ├── notifications/
            │   ├── notification-dropdown.tsx
            │   └── notification-helper.ts
            ├── payment/
            │   ├── payment-request-form.tsx
            │   └── upload-proof.tsx
            ├── profile/
            │   ├── avatar-upload.tsx
            │   ├── bet-history-list.tsx
            │   ├── preferences-form.tsx
            │   ├── profile-form.tsx
            │   ├── statistics-card.tsx
            │   ├── user-level-progress.tsx
            │   └── user-statistics.tsx
            ├── rewards/
            │   ├── reward-card.tsx
            │   ├── reward-detail-dialog.tsx
            │   ├── reward-qr.tsx
            │   └── rewards-content.tsx
            ├── statistics/
            │   ├── activity-feed.tsx
            │   ├── statistics-chart.tsx
            │   └── user-statistics-content.tsx
            ├── ui/
            │   ├── accordion.tsx
            │   ├── alert.tsx
            │   ├── avatar.tsx
            │   ├── badge.tsx
            │   ├── button.tsx
            │   ├── card.tsx
            │   ├── checkbox.tsx
            │   ├── dialog.tsx
            │   ├── dropdown.tsx
            │   ├── form.tsx
            │   ├── input.tsx
            │   ├── loading.tsx
            │   ├── notification.tsx
            │   ├── pagination.tsx
            │   ├── progress.tsx
            │   ├── radio-group.tsx
            │   ├── select.tsx
            │   ├── skeleton.tsx
            │   ├── switch.tsx
            │   ├── tabs.tsx
            │   └── textarea.tsx
            └── user/
                ├── LevelBadge.tsx
                ├── UserLevelDetails.tsx
                └── UserStatsCards.tsx


# Bảng Mô Tả Chi Tiết Các Components Trong Dự Án

## 1. Components Admin - Quản Trị Viên

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| AdminDashboardContent | src/components/admin/admin/admin-dashboard-content.tsx | Hiển thị bảng điều khiển tổng quan cho quản trị viên với các thống kê về người dùng, game, thanh toán và biểu đồ phân tích doanh thu |
| AdminSidebar | src/components/admin/admin/admin-sidebar.tsx | Thanh điều hướng bên cho trang quản trị, chứa các liên kết đến các chức năng quản lý khác nhau |
| AdminGameControl | src/components/admin/games/admin-game-control.tsx | Điều khiển lượt chơi đang diễn ra và kết thúc lượt chơi bằng cách chọn số trúng thưởng |
| AdminGameDetail | src/components/admin/games/admin-game-detail.tsx | Hiển thị chi tiết lượt chơi, danh sách người đặt cược, cho phép xuất CSV và quản lý lượt chơi |
| AdminGameForm | src/components/admin/games/admin-game-form.tsx | Form tạo mới hoặc cập nhật thông tin lượt chơi với các tùy chọn về thời gian, trạng thái |
| AdminGameList | src/components/admin/games/admin-game-list.tsx | Hiển thị danh sách tất cả lượt chơi với bộ lọc, phân trang và các chức năng quản lý nhanh |
| AdminGamesContent | src/components/admin/games/admin-games-content.tsx | Tổng hợp và quản lý lượt chơi với các chức năng tạo mới, sửa, xóa, kết thúc |

## 2. Components Auth - Xác Thực

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| ChangePasswordForm | src/components/auth/change-password-form.tsx | Form đổi mật khẩu với xác thực mật khẩu hiện tại và kiểm tra độ mạnh của mật khẩu mới |
| ForgotPasswordForm | src/components/auth/forgot-password-form.tsx | Form yêu cầu đặt lại mật khẩu thông qua email khi người dùng quên mật khẩu |
| LoginForm | src/components/auth/login-form.tsx | Form đăng nhập với xác thực email/mật khẩu và tùy chọn ghi nhớ đăng nhập |
| RegisterForm | src/components/auth/register-form.tsx | Form đăng ký tài khoản mới với các trường thông tin cơ bản và mã giới thiệu |

## 3. Components Dashboard - Bảng Điều Khiển

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| ActivityFeed | src/components/dashboard/activity-feed.tsx | Hiển thị luồng hoạt động gần đây của người dùng như đặt cược, thắng, nạp tiền |
| DashboardContent | src/components/dashboard/dashboard-content.tsx | Trang chính của dashboard người dùng, hiển thị số dư, thống kê, lượt chơi đang diễn ra |
| FeaturedGames | src/components/dashboard/featured-games.tsx | Hiển thị các lượt chơi nổi bật/đang diễn ra cho người dùng dễ dàng tham gia |
| StatisticsCharts | src/components/dashboard/statistics-charts.tsx | Biểu đồ thống kê về hoạt động cá cược, thắng/thua và xu hướng của người dùng |
| StatisticsWidget | src/components/dashboard/statistics-widget.tsx | Widget nhỏ hiển thị tóm tắt thống kê hoạt động, tỷ lệ thắng và chi tiết thống kê |

## 4. Components Game - Trò Chơi

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| BetForm | src/components/game/bet-form.tsx | Form đặt cược cho người dùng chọn số và nhập số tiền cược |
| BetList | src/components/game/bet-list.tsx | Hiển thị danh sách đặt cược với các tùy chọn lọc, tìm kiếm và phân trang |
| BetSuccessDialog | src/components/game/bet-success-dialog.tsx | Dialog hiển thị xác nhận đặt cược thành công với hiệu ứng confetti |
| GameActivity | src/components/game/game-activity.tsx | Hiển thị hoạt động đặt cược trong thời gian thực, tự động cập nhật khi có cược mới |
| GameCard | src/components/game/game-card.tsx | Card hiển thị thông tin tổng quan về một lượt chơi (số người tham gia, thời gian, số trúng) |
| GameCountdown | src/components/game/game-countdown.tsx | Hiển thị đồng hồ đếm ngược thời gian còn lại của lượt chơi |
| GameDetail | src/components/game/game-detail.tsx | Trang chi tiết lượt chơi bao gồm form đặt cược, lịch sử cược, kết quả |
| GameList | src/components/game/game-list.tsx | Hiển thị danh sách lượt chơi với bộ lọc theo trạng thái và phân trang |
| GameResultBanner | src/components/game/game-result-banner.tsx | Banner thông báo kết quả lượt chơi, hiển thị nếu thắng hoặc thua |
| GameResultDetail | src/components/game/game-result-detail.tsx | Hiển thị chi tiết kết quả lượt chơi bao gồm số trúng, tiền thưởng và phân tích |
| GameResultStats | src/components/game/game-result-stats.tsx | Hiển thị thống kê về kết quả lượt chơi như tỷ lệ thắng, số người tham gia |
| GameRewardCard | src/components/game/game-reward-card.tsx | Card hiển thị thông tin về phần thưởng nhận được từ lượt chơi |
| GameStatusChecker | src/components/game/game-status-checker.tsx | Kiểm tra và cập nhật trạng thái lượt chơi trong thời gian thực |
| WinnerAnimation | src/components/game/winner-animation.tsx | Hiệu ứng động chúc mừng khi người dùng thắng cược |

## 5. Components History - Lịch Sử

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| HistoryContent | src/components/history/history-content.tsx | Hiển thị lịch sử đặt cược và thanh toán của người dùng, có chức năng lọc và xuất CSV |

## 6. Components Layout - Bố Cục

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| Footer | src/components/layouts/footer.tsx | Footer cho toàn bộ trang web hiển thị thông tin liên hệ, giới thiệu và liên kết |
| Navbar | src/components/layouts/main-layout.tsx | Thanh điều hướng chính với menu người dùng, thông báo và điều hướng toàn ứng dụng |

## 7. Components Notifications - Thông Báo

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| NotificationDropdown | src/components/notifications/notification-dropdown.tsx | Dropdown hiển thị danh sách thông báo, cho phép đánh dấu đã đọc và xóa |
| NotificationHelper | src/components/notifications/notification-helper.ts | Các hàm tiện ích để hiển thị toast notifications (thành công, lỗi, thông tin) |

## 8. Components Payment - Thanh Toán

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| PaymentRequestForm | src/components/payment/payment-request-form.tsx | Form yêu cầu nạp tiền vào tài khoản, chọn số tiền và tải lên bằng chứng |
| UploadProof | src/components/payment/upload-proof.tsx | Component tải lên bằng chứng thanh toán với hỗ trợ kéo thả và xem trước |

## 9. Components Profile - Hồ Sơ

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| AvatarUpload | src/components/profile/avatar-upload.tsx | Component tải lên và quản lý avatar người dùng với xem trước |
| BetHistoryList | src/components/profile/bet-history-list.tsx | Hiển thị lịch sử đặt cược của người dùng với phân trang |
| PreferencesForm | src/components/profile/preferences-form.tsx | Form cài đặt tùy chọn người dùng (thông báo, giao diện, riêng tư, ngôn ngữ) |
| ProfileForm | src/components/profile/profile-form.tsx | Form cập nhật thông tin hồ sơ cá nhân của người dùng |
| StatisticsCard | src/components/profile/statistics-card.tsx | Card hiển thị thống kê hoạt động và tài khoản của người dùng |
| UserLevelProgress | src/components/profile/user-level-progress.tsx | Hiển thị tiến độ cấp độ người dùng và thông tin lên cấp |
| UserStatistics | src/components/profile/user-statistics.tsx | Hiển thị thống kê chi tiết về hoạt động người dùng theo thời gian |

## 10. Components Rewards - Phần Thưởng

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| RewardDetailDialog | src/components/rewards/reward-detail-dialog.tsx | Dialog hiển thị chi tiết phần thưởng và cho phép đổi thưởng |
| RewardQR | src/components/rewards/reward-qr.tsx | Hiển thị mã QR cho phần thưởng, có chức năng tải xuống và sao chép |
| RewardsContent | src/components/rewards/rewards-content.tsx | Trang hiển thị danh sách phần thưởng với bộ lọc, tìm kiếm và quản lý |

## 11. Components Statistics - Thống Kê

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| ActivityFeed | src/components/statistics/activity-feed.tsx | Hiển thị luồng hoạt động người dùng theo nhiều loại khác nhau |
| StatisticsChart | src/components/statistics/statistics-chart.tsx | Hiển thị biểu đồ thống kê hoạt động người dùng theo nhiều dạng (pie, bar, line) |
| UserStatisticsContent | src/components/statistics/user-statistics-content.tsx | Trang thống kê toàn diện về hoạt động của người dùng với nhiều tab thông tin |

## 12. Components UI - Giao Diện Người Dùng

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| Accordion | src/components/ui/accordion.tsx | Component accordion có thể mở rộng/thu gọn nội dung |
| Alert | src/components/ui/alert.tsx | Component thông báo cảnh báo với nhiều biến thể (info, success, warning, error) |
| Avatar | src/components/ui/avatar.tsx | Component hiển thị avatar người dùng với fallback và nhiều kích thước |
| Badge | src/components/ui/badge.tsx | Component badge hiển thị nhãn nhỏ với nhiều biến thể và kích thước |
| Button | src/components/ui/button.tsx | Component button với nhiều biến thể, kích thước và trạng thái |
| Card | src/components/ui/card.tsx | Component card container với các subcomponents (Header, Title, Content, Footer) |
| Checkbox | src/components/ui/checkbox.tsx | Component checkbox với label, mô tả và trạng thái lỗi |
| Dialog | src/components/ui/dialog.tsx | Component modal dialog có thể tùy chỉnh nội dung |
| Form | src/components/ui/form.tsx | Components liên quan đến form (Group, Section, Row, Divider, Actions) |
| Input | src/components/ui/input.tsx | Component input text với nhiều tùy chọn (label, icon, error) |
| Loading | src/components/ui/loading.tsx | Component loading spinner hiển thị trạng thái đang tải |
| Notification | src/components/ui/notification.tsx | Components liên quan đến thông báo (Item, List, Bell) |
| Pagination | src/components/ui/pagination.tsx | Component phân trang với các nút điều hướng và hiển thị số trang |
| Progress | src/components/ui/progress.tsx | Component thanh tiến trình với nhiều màu sắc và kích thước |
| RadioGroup | src/components/ui/radio-group.tsx | Component nhóm radio buttons với nhiều tùy chọn |
| Select | src/components/ui/select.tsx | Component dropdown select với nhiều tùy chọn |
| Skeleton | src/components/ui/skeleton.tsx | Component skeleton loading placeholder |
| Switch | src/components/ui/switch.tsx | Component công tắc toggle (bật/tắt) |
| Tabs | src/components/ui/tabs.tsx | Component tabs cho phép chuyển đổi giữa các nội dung |
| Textarea | src/components/ui/textarea.tsx | Component textarea với label và trạng thái lỗi |

## 13. Components User - Người Dùng

| Tên Component | Đường Dẫn File | Mô Tả Chức Năng |
|---------------|----------------|-----------------|
| LevelBadge | src/components/user/LevelBadge.tsx | Badge hiển thị cấp độ người dùng với biểu tượng và màu sắc khác nhau |
| UserLevelDetails | src/components/user/UserLevelDetails.tsx | Hiển thị chi tiết về cấp độ người dùng, các đặc quyền và nâng cấp |
| UserStatsCards | src/components/user/UserStatsCards.tsx | Hiển thị các card thống kê về hoạt động của người dùng |