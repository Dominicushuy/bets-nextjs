Theo file `plan.md`, hãy giúp tôi tiếp tục phát triển dự án, hãy bắt đầu với các công việc sau:

## 3. Phát triển hệ thống Game và Cá cược

### 3.1 Quản lý lượt chơi và danh sách game (5 ngày)

#### Backend
- [ ] Bổ sung functions CRUD cho game_rounds
- [ ] Tạo function tạo lượt chơi mới tự động theo lịch
- [ ] Phát triển triggers tự động thông báo khi có lượt chơi mới
- [ ] Thiết lập realtime subscriptions cho cập nhật trạng thái game

#### Frontend Components
- [ ] Xây dựng GameList component (danh sách lượt chơi với filters)
- [ ] Tạo GameCard component (hiển thị thông tin tóm tắt lượt chơi)
- [ ] Phát triển GameFilters component (lọc theo trạng thái, thời gian)
- [ ] Xây dựng GameListSkeleton cho trạng thái loading

#### API Routes
- [ ] Tạo API route `/api/game-rounds` (lấy danh sách lượt chơi)
- [ ] Tạo API route `/api/game-rounds/[id]` (chi tiết lượt chơi)
- [ ] Tạo API route `/api/game-rounds/active` (lấy các lượt chơi đang diễn ra)
- [ ] Tạo API route `/api/admin/game-rounds` (CRUD lượt chơi - admin)

#### Services & Hooks
- [ ] Phát triển GameService (getGames, getGameById)
- [ ] Xây dựng hook useGames để quản lý danh sách games
- [ ] Tạo hook useGame để quản lý chi tiết game
- [ ] Phát triển hook useGameSubscription để nhận cập nhật realtime

*Lưu ý:
- File `code.txt` tôi cung cấp đây bao gồm những phần code có liên quan tôi đang xây dựng từ trước. Những phần nào hiện đã phát triển nếu cần thì có thể cập nhật thêm. Nếu đã hoàn thiện thì bỏ qua, nếu thiếu thì tạo thêm và liên kết vào các Page, Layout có sẵn.
- Kết quả trả về chỉ bao gồm những mục tôi liệt kê ở trên, tôi sẽ hỏi bạn thêm sau đó.
- Đặc biệt hãy kiểm tra tất cả các functions, triggers đã tồn tại trong files file `trigger_functions.sql`​ trước xem đã tồn tại chưa, nếu chưa thì hãy tạo mới, nếu có rồi thì giữ nguyên tên và cập nhật logic (nếu cần).
- Đặc biệt kiểm tra tổng thể cấu trúc dự án đã tồn tại được mô tả trong file `core.md`, `components.md`, `app.md` để hiểu hơn về tổng thể của dự án
