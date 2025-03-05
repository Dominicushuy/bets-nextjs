# Game Cá Cược - Nền tảng Betting toàn diện

Nền tảng betting online toàn diện xây dựng trên Next.js 14 và Supabase.

## Các tính năng

- **Hệ thống xác thực người dùng**: Đăng ký, đăng nhập, quản lý tài khoản
- **Dashboard người dùng**: Xem thống kê, hoạt động gần đây, lượt chơi đang diễn ra
- **Hệ thống Game**: Tham gia lượt chơi, đặt cược, xem kết quả realtime
- **Quản lý tài chính**: Nạp tiền, theo dõi số dư, lịch sử giao dịch
- **Hệ thống phần thưởng**: Tạo và đổi mã thưởng
- **Thông báo**: Theo dõi thông báo về trò chơi, kết quả, thanh toán
- **Admin Panel**: Quản lý người dùng, lượt chơi, thanh toán, và hệ thống

## Công nghệ sử dụng

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, React Query
- **Backend**: Supabase, Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Realtime**: Supabase Realtime
- **Cloud Storage**: Supabase Storage

## Cài đặt và chạy

### Yêu cầu

- Node.js 18+
- npm 7+ hoặc yarn
- Tài khoản Supabase

### Bước 1: Clone dự án

```bash
git clone https://github.com/your-username/game-ca-cuoc.git
cd game-ca-cuoc
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn
```

### Bước 3: Cấu hình Supabase

1. Tạo dự án Supabase mới tại [https://supabase.com](https://supabase.com)
2. Thực hiện các bước sau trong dự án Supabase:
   - Tạo bảng và schema bằng cách chạy file `schema.sql` trong SQL Editor
   - Thiết lập Authentication (Email, Phone)
   - Tạo các RLS Policies bằng cách chạy file `policies.sql`
   - Tạo các Functions bằng cách chạy file `functions.sql` và `new-functions-and-triggers.sql`
   - Thiết lập Storage Buckets cho uploads (user_avatars, payment_proofs)

### Bước 4: Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc của dự án và thêm các biến sau:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Bước 5: Chạy ứng dụng

```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Cấu trúc thư mục

```
src/
├── app/                    # App Router
│   ├── (admin)/            # Admin routes
│   ├── (auth)/             # Auth routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Auth-related components
│   ├── dashboard/          # Dashboard components
│   ├── game/               # Game-related components
│   ├── history/            # History components
│   ├── layouts/            # Layout components
│   ├── notification/       # Notification components
│   ├── payment/            # Payment components
│   ├── profile/            # Profile components
│   └── ui/                 # UI Components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Utility functions
├── providers/              # Context providers
├── services/               # Service modules
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

## Tài liệu phát triển

- [Kế hoạch phát triển](plan.md)
- [Mô tả tính năng](features.md)
- [Schema SQL](schema.sql)

## Đóng góp

1. Fork dự án
2. Tạo branch tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/game-ca-cuoc](https://github.com/your-username/game-ca-cuoc)
