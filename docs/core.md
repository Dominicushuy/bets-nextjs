Directory structure:
└── dominicushuy-bets-nextjs/
    └── src/
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

# Mô Tả Chi Tiết Thành Phần Dự Án

## 1. Hooks

### Authentication Hooks (auth-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useLogin` | Hook đăng nhập với email và mật khẩu, quản lý quá trình đăng nhập và điều hướng sau khi đăng nhập thành công |
| `useRegister` | Hook đăng ký tài khoản mới, hỗ trợ các thông tin như email, mật khẩu, tên hiển thị, số điện thoại và mã giới thiệu |
| `useRequestPasswordReset` | Hook yêu cầu đặt lại mật khẩu thông qua email |
| `useLogout` | Hook đăng xuất người dùng, xóa cache và điều hướng về trang đăng nhập |
| `useCheckAuth` | Hook kiểm tra trạng thái xác thực hiện tại của người dùng |
| `useUpdateUserInfo` | Hook cập nhật thông tin người dùng như email, số điện thoại, tên hiển thị |
| `useChangePassword` | Hook thay đổi mật khẩu của người dùng |
| `usePhoneLogin` | Hook đăng nhập bằng số điện thoại, tự động chuẩn hóa số điện thoại sang định dạng E.164 |

### Game Hooks (game-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useGameRounds` | Hook lấy danh sách các lượt chơi với phân trang và lọc theo trạng thái |
| `useGameRound` | Hook lấy chi tiết của một lượt chơi cụ thể |
| `useGameBets` | Hook lấy các lượt đặt cược trong một lượt chơi |
| `useUserBets` | Hook lấy lịch sử đặt cược của một người dùng |
| `useGameRoundsRealtime` | Hook lấy danh sách lượt chơi với cập nhật theo thời gian thực |
| `useGameRoundDetails` | Hook lấy thông tin chi tiết lượt chơi cùng các cược và thông tin liên quan |
| `usePlaceBet` | Hook đặt cược trong một lượt chơi với số được chọn và số tiền cược |
| `useGameRoundRealtime` | Hook theo dõi cập nhật thời gian thực cho một lượt chơi |
| `useCompleteGameRound` | Hook kết thúc một lượt chơi và xác định số thắng (chỉ Admin) |
| `useGameRoundResults` | Hook lấy kết quả chi tiết của một lượt chơi sau khi kết thúc |
| `useCreateGameRound` | Hook tạo lượt chơi mới (chỉ Admin) |
| `useUpdateGameRound` | Hook cập nhật thông tin lượt chơi (chỉ Admin) |
| `useDeleteGameRound` | Hook xóa một lượt chơi (chỉ Admin) |
| `useGameRoundRealtimeStatus` | Hook theo dõi trạng thái lượt chơi theo thời gian thực |
| `useGameNumberDistribution` | Hook lấy phân phối số lượng đặt cược trên các số khác nhau |

### History Hooks (history-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useHistoryData` | Hook lấy lịch sử hoạt động của người dùng (đặt cược, thanh toán) với phân trang |

### Notification Hooks (notification-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useNotificationList` | Hook lấy danh sách thông báo của người dùng |
| `useUnreadNotificationCount` | Hook lấy số lượng thông báo chưa đọc |
| `useMarkNotificationAsRead` | Hook đánh dấu một thông báo đã đọc |
| `useMarkAllNotificationsAsRead` | Hook đánh dấu tất cả thông báo là đã đọc |
| `useDeleteNotification` | Hook xóa một thông báo |

### Payment Hooks (payment-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `usePaymentRequests` | Hook lấy danh sách yêu cầu thanh toán với các bộ lọc (chỉ Admin) |
| `useUserPaymentRequests` | Hook lấy danh sách yêu cầu thanh toán của một người dùng cụ thể |
| `usePaymentStatistics` | Hook lấy thống kê thanh toán của một người dùng |
| `usePaymentRequestDetail` | Hook lấy chi tiết của một yêu cầu thanh toán |
| `useCreatePaymentRequest` | Hook tạo yêu cầu thanh toán mới, hỗ trợ tải lên hình ảnh minh chứng |
| `useProcessPaymentRequest` | Hook xử lý yêu cầu thanh toán (chấp nhận/từ chối) (chỉ Admin) |
| `useDeletePaymentRequest` | Hook xóa yêu cầu thanh toán |

### Profile Hooks (profile-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useExtendedUserProfile` | Hook lấy thông tin profile đầy đủ của người dùng |
| `useUserStatistics` | Hook lấy thống kê của người dùng |
| `useLevelProgress` | Hook lấy thông tin tiến trình cấp độ của người dùng |
| `useUpdateUserProfile` | Hook cập nhật thông tin profile người dùng |
| `useUploadProfileAvatar` | Hook tải lên ảnh đại diện |
| `useUserPreferences` | Hook lấy tùy chọn cá nhân của người dùng |
| `useUpdateUserPreferences` | Hook cập nhật tùy chọn cá nhân |
| `useUserStatisticsSummary` | Hook lấy thống kê tổng quan của người dùng |
| `useAvatar` | Hook quản lý avatar (tải lên, xóa) |
| `useProfile` | Hook quản lý tất cả thông tin profile |
| `useProfileStats` | Hook lấy thống kê hoạt động người dùng theo khoảng thời gian |
| `useBetHistory` | Hook lấy lịch sử đặt cược với phân trang |

### Reward Hooks (reward-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useUserRewards` | Hook lấy tất cả phần thưởng của người dùng |
| `useRewardDetail` | Hook lấy chi tiết một phần thưởng cụ thể |
| `useRedeemReward` | Hook đổi phần thưởng (redeem) bằng mã code |
| `useRewardStats` | Hook lấy thống kê phần thưởng của người dùng |

### Statistics Hooks (statistics-hooks.ts)
| Hook | Mô tả |
|------|-------|
| `useUserStatistics` | Hook lấy thống kê người dùng theo khoảng thời gian |
| `useLevelBenefits` | Hook lấy phúc lợi theo cấp độ người dùng |
| `useUserActivities` | Hook lấy hoạt động người dùng trong một khoảng thời gian |

### Utility Hooks (use-click-outside.ts)
| Hook | Mô tả |
|------|-------|
| `useOnClickOutside` | Hook xử lý sự kiện click bên ngoài một element (thường dùng cho dropdown, modal) |

## 2. Services

### Game Service (game-service.ts)
| Service | Mô tả |
|---------|-------|
| `getGameRounds` | Lấy danh sách lượt chơi với các bộ lọc và phân trang |
| `getGameRound` | Lấy thông tin chi tiết một lượt chơi |
| `getGameBets` | Lấy danh sách cược trong một lượt chơi |
| `getUserBets` | Lấy lịch sử đặt cược của người dùng |
| `createGameRound` | Tạo lượt chơi mới (chỉ Admin) |
| `getGameRoundDetails` | Lấy thông tin chi tiết lượt chơi và thông tin liên quan |
| `placeBet` | Đặt cược trong một lượt chơi |
| `completeGameRound` | Kết thúc lượt chơi và xác định số thắng (chỉ Admin) |
| `getGameResults` | Lấy kết quả của lượt chơi |
| `redeemReward` | Đổi phần thưởng bằng mã code |

### Notification Service (notification-service.ts)
| Service | Mô tả |
|---------|-------|
| `getUserNotifications` | Lấy thông báo cho người dùng |
| `getUnreadNotificationCount` | Lấy số lượng thông báo chưa đọc |
| `markNotificationAsRead` | Đánh dấu thông báo đã đọc |
| `markAllNotificationsAsRead` | Đánh dấu tất cả thông báo đã đọc |
| `deleteNotification` | Xóa thông báo |
| `createNotification` | Tạo thông báo mới cho người dùng |

### Profile Service (profile-service.ts)
| Service | Mô tả |
|---------|-------|
| `getExtendedUserProfile` | Lấy thông tin profile đầy đủ của người dùng |
| `getUserStatistics` | Lấy thống kê người dùng |
| `getUserLevel` | Lấy thông tin cấp độ người dùng |
| `getNextUserLevel` | Lấy thông tin cấp độ tiếp theo |
| `updateUserProfile` | Cập nhật thông tin người dùng an toàn |
| `updateUserPreferences` | Cập nhật tùy chọn người dùng |
| `uploadProfileAvatar` | Tải lên ảnh đại diện người dùng |
| `calculateExperienceToNextLevel` | Tính toán kinh nghiệm cần để lên cấp tiếp theo |
| `calculateLevelProgress` | Tính toán tiến trình cấp độ với thông tin chi tiết |
| `getUserActivityStats` | Lấy thống kê hoạt động theo khoảng thời gian |
| `getUserBetHistory` | Lấy lịch sử đặt cược với phân trang |

### Reward Service (reward-service.ts)
| Service | Mô tả |
|---------|-------|
| `getUserRewards` | Lấy tất cả phần thưởng của người dùng |
| `getRewardByCode` | Lấy thông tin phần thưởng theo mã code |
| `getRewardStats` | Lấy thống kê phần thưởng của người dùng |
| `redeemReward` | Đổi phần thưởng và cập nhật số dư người dùng |
| `createReward` | Tạo mã thưởng mới |
| `validateRewardCode` | Kiểm tra tính hợp lệ của mã thưởng |

### Statistics Service (statistics-service.ts)
| Service | Mô tả |
|---------|-------|
| `getUserActivityStats` | Lấy thống kê hoạt động người dùng |
| `getLevelBenefits` | Lấy phúc lợi theo cấp độ |
| `getUserDetailedStats` | Lấy thống kê chi tiết của người dùng |

## 3. Providers

### Auth Provider (auth-provider.tsx)
| Component/Hook | Mô tả |
|----------------|-------|
| `AuthProvider` | Provider quản lý toàn bộ xác thực, theo dõi session và profile |
| `useAuth` | Hook để truy cập AuthContext từ bất kỳ component nào |

### Notification Provider (notification-provider.tsx)
| Component/Hook | Mô tả |
|----------------|-------|
| `NotificationProvider` | Provider quản lý thông báo, theo dõi cập nhật và hiển thị toast |
| `useNotifications` | Hook để truy cập thông báo từ component khác |

### Query Provider (query-provider.tsx)
| Component | Mô tả |
|-----------|-------|
| `QueryProvider` | Provider cấu hình React Query với các tùy chọn mặc định |

### Toast Provider (toast-provider.tsx)
| Component | Mô tả |
|-----------|-------|
| `ToastProvider` | Provider cấu hình react-hot-toast với tùy chỉnh giao diện |

## 4. Lib & Utils

### Utility Functions (utils.ts)
| Function | Mô tả |
|----------|-------|
| `cn` | Kết hợp class names với Tailwind CSS |
| `formatCurrency` | Format số tiền sang định dạng VND |
| `formatDateTime` | Format ngày giờ sang định dạng Việt Nam |
| `formatDate` | Format ngày sang định dạng Việt Nam |
| `truncateText` | Rút gọn chuỗi nếu quá dài |

### Supabase Admin (supabase/admin.ts)
| Function | Mô tả |
|----------|-------|
| `createAdminClient` | Tạo Supabase client với quyền admin (service role) |

### Supabase Client (supabase/client.ts)
| Function/Variable | Mô tả |
|-------------------|-------|
| `createClient` | Tạo Supabase client component |
| `supabase` | Instance đã được khởi tạo của Supabase client |

### Supabase Server (supabase/server.ts)
| Function | Mô tả |
|----------|-------|
| `createClient` | Tạo Supabase client cho server components với cache |

### Supabase Storage (supabase/storage.ts)
| Function | Mô tả |
|----------|-------|
| `uploadAvatar` | Upload avatar người dùng đến Supabase Storage |
| `uploadPaymentProof` | Upload minh chứng thanh toán đến Supabase Storage |

## 5. Types & Others

### Database Types (database.ts)
| Type | Mô tả |
|------|-------|
| `ExtendedProfile` | Kiểu dữ liệu mở rộng cho profile người dùng |
| `GameRound` | Kiểu dữ liệu cho lượt chơi |
| `Bet` | Kiểu dữ liệu cho cược |
| `PaymentRequest` | Kiểu dữ liệu cho yêu cầu thanh toán |
| `UserStatistics` | Kiểu dữ liệu cho thống kê người dùng |
| `UserLevel` | Kiểu dữ liệu cho cấp độ người dùng |
| `Notification` | Kiểu dữ liệu cho thông báo |
| `Promotion` | Kiểu dữ liệu cho khuyến mãi |
| `RewardCode` | Kiểu dữ liệu cho mã thưởng |

### Supabase Types (supabase.ts)
| Type | Mô tả |
|------|-------|
| `Database` | Định nghĩa cấu trúc cơ sở dữ liệu Supabase |
| `Tables` | Định nghĩa kiểu dữ liệu cho các bảng |
| `TablesInsert` | Định nghĩa kiểu dữ liệu cho việc chèn dữ liệu |
| `TablesUpdate` | Định nghĩa kiểu dữ liệu cho việc cập nhật dữ liệu |
| `Enums` | Định nghĩa kiểu dữ liệu cho các enum |
| `CompositeTypes` | Định nghĩa kiểu dữ liệu cho các composite types |