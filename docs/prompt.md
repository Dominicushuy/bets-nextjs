Theo file `plan.md`, hãy giúp tôi tiếp tục phát triển dự án, hãy bắt đầu với các công việc sau:

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

Lưu ý:
- File `code.txt` bao gồm những phần code có liên quan tôi đang xây dựng từ trước

- Kết quả trả về chỉ bao gồm những mục tôi liệt kê ở trên,, tôi sẽ hỏi bạn thêm sau đó.

- Những phần nào hiện đã phát triển (kiểm tra trong Github files) nếu cần thì có thể cập nhật thêm, còn không thì bỏ qua.

- Đặc biệt hãy kiểm tra file `trigger_functions.sql`, `policies.sql`​ trước xem đã tồn tại function hoặc triggers chưa trước khi tạo thêm functions hay trigger mới.
