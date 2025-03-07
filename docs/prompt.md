Theo file `plan.md`, hãy giúp tôi tiếp tục phát triển dự án, hãy bắt đầu với các công việc sau:

## 3. Phát triển hệ thống Game và Cá cược

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

*Lưu ý:
- File `code.txt` tôi cung cấp đây bao gồm những phần code có liên quan tôi đang xây dựng từ trước. Những phần nào hiện đã phát triển nếu cần thì có thể cập nhật thêm. Nếu đã hoàn thiện thì bỏ qua, nếu thiếu thì tạo thêm và liên kết vào các Page, Layout có sẵn.
- Kết quả trả về chỉ bao gồm những mục tôi liệt kê ở trên, tôi sẽ hỏi bạn thêm sau đó.
- Đặc biệt hãy kiểm tra tất cả các functions, triggers đã tồn tại trong files file `trigger_functions.sql`​ trước xem đã tồn tại chưa, nếu chưa thì hãy tạo mới, nếu có rồi thì giữ nguyên tên và cập nhật logic (nếu cần).
- Đặc biệt kiểm tra tổng thể cấu trúc dự án đã tồn tại được mô tả trong file `core.md`, `components.md`, `app.md` để hiểu hơn về tổng thể của dự án
