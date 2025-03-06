Theo file `plan.md`, hãy giúp tôi tiếp tục phát triển dự án, hãy bắt đầu với các công việc sau:

## 2. Phát triển hệ thống xác thực và quản lý người dùng

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

Lưu ý:

- Kết quả trả về chỉ bao gồm những mục tôi liệt kê ở trên, tôi sẽ hỏi bạn thêm sau đó.

- Những phần nào hiện đã phát triển (kiểm tra trong Github files) nếu cần thì có thể cập nhật thêm, còn không thì bỏ qua.

- Đặc biệt hãy kiểm tra file `trigger_functions.sql`, `policies.sql`​ trước xem đã tồn tại function hoặc triggers chưa trước khi tạo thêm functions hay trigger mới.
