Theo file `plan.md`, hãy giúp tôi tiếp tục phát triển dự án, hãy bắt đầu với các công việc sau:

## 2. Phát triển hệ thống xác thực và quản lý người dùng

### 2.1 Xây dựng hệ thống Authentication (4 ngày)

#### Backend

- [ ] Cấu hình Supabase Auth với email và phone providers
- [ ] Phát triển function xử lý đăng ký người dùng mới
- [ ] Tạo trigger tự động tạo profile khi user mới được tạo
- [ ] Thiết lập policies cho auth.users và profiles

#### Frontend Components

- [ ] Xây dựng LoginForm component (email/phone, validation, reCaptcha)
- [ ] Xây dựng RegisterForm component (validation, điều khoản sử dụng)
- [ ] Tạo ForgotPasswordForm và ResetPasswordForm components
- [ ] Xây dựng AuthLayout cho các trang authentication

#### API Routes

- [ ] Tạo API route `/api/auth/register` (xử lý đăng ký, gửi email xác nhận)
- [ ] Tạo API route `/api/auth/login` (xác thực, tạo session)
- [ ] Tạo API route `/api/auth/verify-email` (xác minh email)
- [ ] Tạo API route `/api/auth/reset-password` và `/api/auth/forgot-password`

#### Services & Hooks

- [ ] Phát triển AuthService (login, register, reset password)
- [ ] Xây dựng hook useAuth để quản lý trạng thái authentication
- [ ] Tạo AuthProvider context để chia sẻ trạng thái đăng nhập
- [ ] Tạo middleware để kiểm tra authentication cho các routes được bảo vệ

Lưu ý:

- Kết quả trả về chỉ bao gồm những mục tôi liệt kê ở trên, tôi sẽ hỏi bạn thêm sau đó.

- Những phần nào hiện đã phát triển (kiểm tra trong Github files) nếu cần thì có thể cập nhật thêm, còn không thì bỏ qua.

- Đặc biệt hãy kiểm tra file `trigger_functions.sql`, `policies.sql`​ trước xem đã tồn tại function hoặc triggers chưa trước khi tạo thêm functions hay trigger mới.
