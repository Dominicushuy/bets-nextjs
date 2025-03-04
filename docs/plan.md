# Kế hoạch phát triển dự án Game Cá Cược

Dựa trên phân tích hệ thống và các services đã có, tôi sẽ trình bày kế hoạch phát triển chi tiết cho dự án này.

## I. Tổng quan các tính năng chính

1. **Hệ thống xác thực người dùng**

   - Đăng nhập/đăng ký bằng số điện thoại
   - Phân quyền admin/user

2. **Hệ thống Game/Cá cược**

   - Danh sách lượt chơi đang diễn ra
   - Chi tiết lượt chơi và đặt cược
   - Xử lý kết quả và phần thưởng

3. **Quản lý thanh toán**

   - Yêu cầu nạp tiền với minh chứng
   - Phê duyệt thanh toán (admin)
   - Lịch sử giao dịch

4. **Hồ sơ người dùng**

   - Thông tin cá nhân
   - Thống kê người dùng
   - Cập nhật hồ sơ

5. **Bảng điều khiển Admin**

   - Quản lý người dùng
   - Quản lý lượt chơi
   - Phê duyệt thanh toán
   - Thống kê hệ thống

6. **Hệ thống phần thưởng**

   - Mã code phần thưởng
   - Đổi thưởng

7. **Khuyến mãi & Giới thiệu**

   - Quản lý khuyến mãi
   - Hệ thống giới thiệu người dùng

8. **Thông báo**
   - Quản lý thông báo người dùng

## II. Chi tiết kế hoạch phát triển

### 1. Hệ thống xác thực người dùng

**Bước 1: Cài đặt Provider xác thực**

- Tính năng: Authentication với Supabase
- Các file cần tạo/cập nhật:
  - `/src/providers/auth-provider.tsx`: Cung cấp context xác thực toàn ứng dụng
  - `/src/hooks/auth-hooks.ts`: Custom hooks xác thực

**Bước 2: Trang đăng nhập**

- Tính năng: Form đăng nhập với số điện thoại/email và mật khẩu
- Các file cần tạo/cập nhật:
  - `/src/app/(auth)/login/page.tsx`: Trang đăng nhập
  - `/src/components/auth/login-form.tsx`: Component form đăng nhập
  - `/src/app/api/auth/login/route.ts`: API route xử lý đăng nhập

**Bước 3: Trang đăng ký**

- Tính năng: Form đăng ký với SĐT và thông tin cơ bản
- Các file cần tạo/cập nhật:
  - `/src/app/(auth)/register/page.tsx`: Trang đăng ký
  - `/src/components/auth/register-form.tsx`: Component form đăng ký
  - `/src/app/api/auth/register/route.ts`: API route xử lý đăng ký
  - `/src/services/authService.ts`: Cập nhật phương thức tạo tài khoản

**Bước 4: Middleware bảo vệ routes**

- Tính năng: Kiểm tra xác thực và phân quyền
- Các file cần tạo/cập nhật:
  - `/src/middleware.ts`: Middleware xác thực routes

### 2. Hệ thống Game/Cá cược

**Bước 1: Danh sách lượt chơi**

- Tính năng: Hiển thị lượt chơi đang diễn ra và đã hoàn thành
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/games/page.tsx`: Trang danh sách lượt chơi
  - `/src/components/game/game-list.tsx`: Component hiển thị danh sách
  - `/src/hooks/game-hooks.ts`: Hooks để lấy dữ liệu game
  - `/src/app/api/game-rounds/route.ts`: API route lấy danh sách lượt chơi

**Bước 2: Chi tiết lượt chơi**

- Tính năng: Hiển thị thông tin chi tiết và cho phép đặt cược
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/games/[id]/page.tsx`: Trang chi tiết lượt chơi
  - `/src/components/game/game-detail.tsx`: Component hiển thị chi tiết
  - `/src/components/game/bet-form.tsx`: Form đặt cược
  - `/src/app/api/game-rounds/[id]/route.ts`: API route lấy chi tiết lượt chơi
  - `/src/app/api/game-rounds/bets/route.ts`: API route xử lý đặt cược

**Bước 3: Xử lý kết quả**

- Tính năng: Xác định người thắng, tạo phần thưởng
- Các file cần tạo/cập nhật:
  - `/src/app/api/game-rounds/[id]/complete/route.ts`: API route kết thúc lượt chơi
  - `/src/services/gameService.ts`: Cập nhật phương thức xử lý kết quả

**Bước 4: Quản lý lượt chơi (Admin)**

- Tính năng: Tạo, cập nhật, kết thúc lượt chơi
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/games/page.tsx`: Trang quản lý lượt chơi
  - `/src/components/admin/games/game-form.tsx`: Form tạo/cập nhật lượt chơi
  - `/src/components/admin/games/game-list.tsx`: Component danh sách lượt chơi
  - `/src/app/api/admin/games/route.ts`: API route quản lý lượt chơi

### 3. Quản lý thanh toán

**Bước 1: Yêu cầu nạp tiền**

- Tính năng: Form gửi yêu cầu nạp tiền với minh chứng
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/payment-request/page.tsx`: Trang yêu cầu nạp tiền
  - `/src/components/payment/payment-request-form.tsx`: Form yêu cầu nạp tiền
  - `/src/components/payment/upload-proof.tsx`: Component upload minh chứng
  - `/src/app/api/payment-requests/route.ts`: API route xử lý yêu cầu

**Bước 2: Lịch sử giao dịch**

- Tính năng: Hiển thị lịch sử nạp tiền và đặt cược
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/history/page.tsx`: Trang lịch sử
  - `/src/components/history/history-content.tsx`: Component hiển thị lịch sử
  - `/src/hooks/payment-hooks.ts`: Hooks để lấy dữ liệu thanh toán

**Bước 3: Quản lý thanh toán (Admin)**

- Tính năng: Duyệt/từ chối yêu cầu nạp tiền
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/payment-requests/page.tsx`: Trang quản lý thanh toán
  - `/src/components/admin/payment-requests/payment-request-list.tsx`: Component danh sách
  - `/src/components/admin/payment-requests/payment-request-approval.tsx`: Component phê duyệt
  - `/src/app/api/admin/payment-requests/[id]/route.ts`: API route phê duyệt

### 4. Hồ sơ người dùng

**Bước 1: Trang hồ sơ**

- Tính năng: Hiển thị và cho phép cập nhật thông tin cá nhân
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/profile/page.tsx`: Trang hồ sơ
  - `/src/components/profile/profile-form.tsx`: Form cập nhật hồ sơ
  - `/src/components/profile/avatar-upload.tsx`: Component upload avatar
  - `/src/app/api/profile/route.ts`: API route lấy/cập nhật hồ sơ

**Bước 2: Thống kê người dùng**

- Tính năng: Hiển thị thống kê cá nhân (tỷ lệ thắng, phần thưởng...)
- Các file cần tạo/cập nhật:
  - `/src/components/profile/statistics-card.tsx`: Component thống kê
  - `/src/hooks/profile-hooks.ts`: Hooks để lấy dữ liệu hồ sơ và thống kê

### 5. Bảng điều khiển Admin

**Bước 1: Layout Admin**

- Tính năng: Navigation sidebar và layout cho admin
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/layout.tsx`: Layout admin
  - `/src/components/admin/admin/admin-sidebar.tsx`: Sidebar cho admin

**Bước 2: Dashboard Admin**

- Tính năng: Hiển thị tổng quan hệ thống
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/dashboard/page.tsx`: Trang dashboard admin
  - `/src/components/admin/admin/admin-dashboard-content.tsx`: Content dashboard
  - `/src/app/api/admin/dashboard-summary/route.ts`: API route lấy thống kê

**Bước 3: Quản lý người dùng**

- Tính năng: Danh sách, thông tin chi tiết, cập nhật người dùng
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/users/page.tsx`: Trang quản lý người dùng
  - `/src/components/admin/users/user-list.tsx`: Component danh sách
  - `/src/components/admin/users/user-form.tsx`: Form cập nhật người dùng
  - `/src/app/api/admin/users/route.ts`: API route quản lý người dùng

**Bước 4: Nhật ký hệ thống**

- Tính năng: Xem logs hoạt động hệ thống
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/logs/page.tsx`: Trang logs
  - `/src/components/admin/logs/logs-table.tsx`: Component hiển thị logs
  - `/src/app/api/admin/logs/route.ts`: API route lấy logs

### 6. Hệ thống phần thưởng

**Bước 1: Trang phần thưởng**

- Tính năng: Hiển thị mã phần thưởng của người dùng
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/rewards/page.tsx`: Trang phần thưởng
  - `/src/components/reward/reward-list.tsx`: Component danh sách phần thưởng
  - `/src/components/reward/reward-card.tsx`: Card hiển thị phần thưởng
  - `/src/hooks/reward-hooks.ts`: Hooks để lấy dữ liệu phần thưởng

**Bước 2: Mã QR phần thưởng**

- Tính năng: Tạo mã QR cho phần thưởng
- Các file cần tạo/cập nhật:
  - `/src/components/reward/reward-qr.tsx`: Component tạo mã QR
  - `/src/app/api/rewards/[code]/route.ts`: API route lấy thông tin mã

**Bước 3: Quản lý phần thưởng (Admin)**

- Tính năng: Tạo, cập nhật, hủy mã phần thưởng
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/rewards/page.tsx`: Trang quản lý phần thưởng
  - `/src/components/admin/rewards/reward-form.tsx`: Form tạo phần thưởng
  - `/src/app/api/admin/rewards/route.ts`: API route quản lý phần thưởng

### 7. Khuyến mãi & Giới thiệu

**Bước 1: Trang khuyến mãi**

- Tính năng: Hiển thị khuyến mãi đang có
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/promotions/page.tsx`: Trang khuyến mãi
  - `/src/components/promotion/promotion-list.tsx`: Component danh sách
  - `/src/hooks/promotion-hooks.ts`: Hooks để lấy dữ liệu khuyến mãi

**Bước 2: Hệ thống giới thiệu**

- Tính năng: Tạo mã giới thiệu, theo dõi người giới thiệu
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/referrals/page.tsx`: Trang giới thiệu
  - `/src/components/referral/referral-code.tsx`: Component hiển thị mã
  - `/src/components/referral/referral-stats.tsx`: Component thống kê giới thiệu
  - `/src/app/api/referrals/route.ts`: API route lấy/tạo mã giới thiệu

**Bước 3: Quản lý khuyến mãi (Admin)**

- Tính năng: Tạo, cập nhật, hủy khuyến mãi
- Các file cần tạo/cập nhật:
  - `/src/app/(admin)/admin/promotions/page.tsx`: Trang quản lý khuyến mãi
  - `/src/components/admin/promotions/promotion-form.tsx`: Form tạo khuyến mãi
  - `/src/app/api/admin/promotions/route.ts`: API route quản lý khuyến mãi

### 8. Thông báo

**Bước 1: Hệ thống thông báo**

- Tính năng: Thông báo trong ứng dụng
- Các file cần tạo/cập nhật:
  - `/src/providers/notification-provider.tsx`: Provider quản lý thông báo
  - `/src/components/ui/notification.tsx`: Component hiển thị thông báo
  - `/src/hooks/notification-hooks.ts`: Hooks để lấy/quản lý thông báo

**Bước 2: Trang thông báo**

- Tính năng: Hiển thị tất cả thông báo
- Các file cần tạo/cập nhật:
  - `/src/app/(dashboard)/notifications/page.tsx`: Trang thông báo
  - `/src/components/notification/notification-list.tsx`: Component danh sách
  - `/src/app/api/notifications/route.ts`: API route quản lý thông báo

## III. Thứ tự triển khai và kết quả đạt được

### Giai đoạn 1: Xác thực và Cơ sở

1. **Xác thực người dùng**

   - Đăng nhập/đăng ký
   - Phân quyền admin/user
   - Middleware bảo vệ routes

2. **Layout cơ bản**
   - Dashboard layout
   - Admin layout
   - Components UI chung (Button, Card, Dialog...)

**Kết quả:** Hệ thống xác thực hoạt động, phân quyền người dùng, layout cơ bản cho ứng dụng.

### Giai đoạn 2: Tính năng cốt lõi

3. **Hệ thống Game**

   - Danh sách và chi tiết lượt chơi
   - Đặt cược
   - Xử lý kết quả

4. **Quản lý thanh toán**
   - Yêu cầu nạp tiền
   - Phê duyệt thanh toán
   - Lịch sử giao dịch

**Kết quả:** Người dùng có thể xem danh sách lượt chơi, đặt cược, yêu cầu nạp tiền và xem lịch sử.

### Giai đoạn 3: Quản trị và tính năng nâng cao

5. **Dashboard người dùng**

   - Thống kê cá nhân
   - Truy cập nhanh các tính năng

6. **Bảng điều khiển Admin**

   - Quản lý người dùng
   - Quản lý lượt chơi
   - Quản lý thanh toán
   - Thống kê hệ thống

7. **Hệ thống phần thưởng và Khuyến mãi**

   - Quản lý mã phần thưởng
   - Khuyến mãi
   - Giới thiệu người dùng

8. **Thông báo và cải tiến**
   - Hệ thống thông báo
   - Cải tiến UI/UX

**Kết quả:** Hệ thống đầy đủ các tính năng, từ cơ bản đến nâng cao, phục vụ cả người dùng và quản trị viên.

## IV. Kết hợp các thành phần

### Luồng chính của người dùng:

1. **Đăng nhập** → **Dashboard** → **Xem danh sách lượt chơi** → **Đặt cược** → **Xem kết quả** → **Nhận phần thưởng**

- `auth-provider.tsx` + `login-form.tsx` → `dashboard-content.tsx` → `game-list.tsx` → `bet-form.tsx` → `reward-card.tsx`

2. **Nạp tiền**: Dashboard → Yêu cầu nạp tiền → Upload minh chứng → Chờ duyệt → Cập nhật số dư

- `dashboard-content.tsx` → `payment-request-form.tsx` → `upload-proof.tsx` → (Admin duyệt) → Cập nhật số dư

### Luồng chính của admin:

1. **Đăng nhập** → **Admin Dashboard** → **Xem thống kê** → **Quản lý lượt chơi/thanh toán/người dùng**

- `auth-provider.tsx` + `login-form.tsx` → `admin-dashboard-content.tsx` → `game-list.tsx`/`payment-request-list.tsx`/`user-list.tsx`

2. **Tạo lượt chơi mới**: Admin Dashboard → Quản lý lượt chơi → Tạo mới → Cấu hình → Kích hoạt

- `admin-dashboard-content.tsx` → `game-list.tsx` → `game-form.tsx` → Kích hoạt

## V. Tóm tắt

Kế hoạch phát triển này đã chi tiết hóa các tính năng cần thiết cho dự án Game Cá Cược, từ các thành phần UI đến API routes và logic xử lý. Mỗi tính năng được phân chia thành các bước nhỏ với danh sách các file cần tạo hoặc cập nhật.

Việc triển khai theo trình tự đề xuất sẽ đảm bảo xây dựng hệ thống từ cơ bản đến nâng cao, giúp phát triển ổn định và kiểm soát chất lượng. Hệ thống cuối cùng sẽ cung cấp trải nghiệm hoàn chỉnh cho cả người dùng thông thường và quản trị viên.
