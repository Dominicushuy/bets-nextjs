#!/bin/bash  

# Tên dự án từ tham số dòng lệnh hoặc sử dụng giá trị mặc định  
PROJECT_NAME=${1:-"my-nextjs-app"}  

# Tạo dự án Next.js mới  
echo "Đang tạo dự án Next.js mới với tên: $PROJECT_NAME"  
npx create-next-app@latest $PROJECT_NAME --typescript --tailwind --eslint  

# Di chuyển vào thư mục dự án  
cd $PROJECT_NAME  

# Cài đặt các package cần thiết  
echo "Đang cài đặt các package cần thiết..."  
npm install @supabase/supabase-js @tanstack/react-query @tanstack/react-query-devtools @headlessui/react lucide-react react-hot-toast

# Tạo cấu trúc thư mục và file  
echo "Đang tạo cấu trúc thư mục và file..."  

# Tạo các thư mục API routes  
mkdir -p src/app/api/admin/dashboard-summary  
mkdir -p src/app/api/admin/users  
mkdir -p src/app/api/admin/games/[id]  
mkdir -p src/app/api/admin/payment-requests/[id]  
mkdir -p src/app/api/auth/register  
mkdir -p src/app/api/auth/login  
mkdir -p src/app/api/game-rounds/[id]/bets  
mkdir -p src/app/api/payment-requests  
mkdir -p src/app/api/rewards/[code]/redeem  
mkdir -p src/app/api/profile  

# Tạo các file route.ts cho API  
touch src/app/api/admin/dashboard-summary/route.ts  
touch src/app/api/admin/users/route.ts  
touch src/app/api/admin/games/route.ts  
touch src/app/api/admin/games/[id]/route.ts  
touch src/app/api/admin/payment-requests/route.ts  
touch src/app/api/admin/payment-requests/[id]/route.ts  
touch src/app/api/auth/register/route.ts  
touch src/app/api/auth/login/route.ts  
touch src/app/api/game-rounds/route.ts  
touch src/app/api/game-rounds/[id]/route.ts  
touch src/app/api/game-rounds/[id]/bets/route.ts  
touch src/app/api/payment-requests/route.ts  
touch src/app/api/rewards/route.ts  
touch src/app/api/rewards/[code]/route.ts  
touch src/app/api/rewards/[code]/redeem/route.ts  
touch src/app/api/profile/route.ts  

# Tạo các thư mục và file cho auth pages  
mkdir -p src/app/\(auth\)/login  
mkdir -p src/app/\(auth\)/register  
touch src/app/\(auth\)/login/page.tsx  
touch src/app/\(auth\)/register/page.tsx  
touch src/app/\(auth\)/layout.tsx  

# Tạo các thư mục và file cho dashboard pages  
mkdir -p src/app/\(dashboard\)/dashboard  
mkdir -p src/app/\(dashboard\)/games/[id]  
mkdir -p src/app/\(dashboard\)/history  
mkdir -p src/app/\(dashboard\)/payment-request  
mkdir -p src/app/\(dashboard\)/profile  
mkdir -p src/app/\(dashboard\)/promotions  
mkdir -p src/app/\(dashboard\)/rewards  
touch src/app/\(dashboard\)/dashboard/page.tsx  
touch src/app/\(dashboard\)/games/page.tsx  
touch src/app/\(dashboard\)/games/[id]/page.tsx  
touch src/app/\(dashboard\)/history/page.tsx  
touch src/app/\(dashboard\)/payment-request/page.tsx  
touch src/app/\(dashboard\)/profile/page.tsx  
touch src/app/\(dashboard\)/promotions/page.tsx  
touch src/app/\(dashboard\)/rewards/page.tsx  
touch src/app/\(dashboard\)/layout.tsx  

# Tạo các thư mục và file cho admin pages  
mkdir -p src/app/\(admin\)/admin/dashboard  
mkdir -p src/app/\(admin\)/admin/games/[id]  
mkdir -p src/app/\(admin\)/admin/games/new  
mkdir -p src/app/\(admin\)/admin/logs  
mkdir -p src/app/\(admin\)/admin/payment-requests  
mkdir -p src/app/\(admin\)/admin/promotions  
mkdir -p src/app/\(admin\)/admin/rewards  
mkdir -p src/app/\(admin\)/admin/users  
touch src/app/\(admin\)/admin/dashboard/page.tsx  
touch src/app/\(admin\)/admin/games/page.tsx  
touch src/app/\(admin\)/admin/games/[id]/page.tsx  
touch src/app/\(admin\)/admin/games/new/page.tsx  
touch src/app/\(admin\)/admin/logs/page.tsx  
touch src/app/\(admin\)/admin/payment-requests/page.tsx  
touch src/app/\(admin\)/admin/promotions/page.tsx  
touch src/app/\(admin\)/admin/rewards/page.tsx  
touch src/app/\(admin\)/admin/users/page.tsx  
touch src/app/\(admin\)/admin/layout.tsx  

# Tạo layout và page chính  
touch src/app/layout.tsx  
touch src/app/page.tsx  

# Tạo các thư mục và file cho components  
mkdir -p src/components/admin/games  
mkdir -p src/components/admin/payment-requests  
mkdir -p src/components/admin/users  
mkdir -p src/components/dashboard  
mkdir -p src/components/game  
mkdir -p src/components/layouts  
mkdir -p src/components/profile  
mkdir -p src/components/reward  
mkdir -p src/components/ui  

# Tạo các file component  
touch src/components/admin/admin-dashboard-content.tsx  
touch src/components/admin/admin-header.tsx  
touch src/components/admin/admin-sidebar.tsx  
touch src/components/admin/games/game-form.tsx  
touch src/components/admin/games/game-list.tsx  
touch src/components/admin/payment-requests/payment-request-approval.tsx  
touch src/components/admin/payment-requests/payment-request-list.tsx  
touch src/components/admin/users/user-form.tsx  
touch src/components/admin/users/user-list.tsx  
touch src/components/dashboard/dashboard-content.tsx  
touch src/components/game/bet-form.tsx  
touch src/components/game/game-card.tsx  
touch src/components/game/game-list.tsx  
touch src/components/layouts/main-layout.tsx  
touch src/components/profile/profile-form.tsx  
touch src/components/profile/statistics-card.tsx  
touch src/components/reward/reward-card.tsx  
touch src/components/reward/reward-qr.tsx  
touch src/components/ui/avatar.tsx  
touch src/components/ui/badge.tsx  
touch src/components/ui/button.tsx  
touch src/components/ui/card.tsx  
touch src/components/ui/dialog.tsx  
touch src/components/ui/dropdown.tsx  
touch src/components/ui/loading.tsx  
touch src/components/ui/notification.tsx  

# Tạo các thư mục và file cho hooks  
mkdir -p src/hooks  
touch src/hooks/auth-hooks.ts  
touch src/hooks/game-hooks.ts  
touch src/hooks/notification-hooks.ts  
touch src/hooks/payment-hooks.ts  
touch src/hooks/profile-hooks.ts  
touch src/hooks/promotion-hooks.ts  
touch src/hooks/reward-hooks.ts  

# Tạo các thư mục và file cho lib  
mkdir -p src/lib/supabase  
touch src/lib/supabase/client.ts  
touch src/lib/supabase/server.ts  
touch src/lib/utils.ts  

# Tạo các thư mục và file cho providers  
mkdir -p src/providers  
touch src/providers/auth-provider.tsx  
touch src/providers/notification-provider.tsx  
touch src/providers/query-provider.tsx  

# Tạo các thư mục và file cho services  
mkdir -p src/services  
touch src/services/auth-service.ts  
touch src/services/game-service.ts  
touch src/services/notification-service.ts  
touch src/services/payment-service.ts  
touch src/services/profile-service.ts  
touch src/services/promotion-service.ts  
touch src/services/reward-service.ts  

# Tạo các thư mục và file cho types  
mkdir -p src/types  
touch src/types/database.ts  
touch src/types/supabase.ts  

# Tạo các thư mục và file cho styles  
mkdir -p src/styles  
touch src/styles/globals.css

# Tạo thư mục public/assets và file favicon  
mkdir -p public/assets  
touch public/favicon.ico  

# Tạo các file khác ở thư mục gốc  
touch middleware.ts  
touch .env  
touch .env.local  

# Thêm nội dung cơ bản cho .env  
echo "# Environment variables  
DATABASE_URL=\"postgresql://username:password@localhost:5432/database\"  
NEXT_PUBLIC_SUPABASE_URL=\"your-supabase-url\"  
NEXT_PUBLIC_SUPABASE_ANON_KEY=\"your-supabase-anon-key\"  
" > .env  

# Thêm nội dung cơ bản cho .env.local  
echo "# Local environment variables (không commit lên git)  
" > .env.local  

echo "Đã hoàn thành tạo cấu trúc dự án Next.js!"  