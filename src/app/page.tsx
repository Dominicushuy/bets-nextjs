'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Gamepad2,
  Shield,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export default function HomePage() {
  // Animation effect for the hero section
  useEffect(() => {
    const fadeInElements = document.querySelectorAll('.fade-in')
    fadeInElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('opacity-100')
        element.classList.remove('translate-y-4')
      }, 100 * index)
    })
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden'>
      {/* Background particles */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-primary-500/20'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className='relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/10'>
        <div className='flex items-center'>
          <Gamepad2 className='h-8 w-8 text-primary-500 mr-2' />
          <span className='font-bold text-xl'>GameZone</span>
        </div>
        <div className='hidden md:flex items-center space-x-6'>
          <Link
            href='#'
            className='text-white/80 hover:text-white transition-colors'>
            Trò chơi
          </Link>
          <Link
            href='#'
            className='text-white/80 hover:text-white transition-colors'>
            Khuyến mãi
          </Link>
          <Link
            href='#'
            className='text-white/80 hover:text-white transition-colors'>
            Giới thiệu
          </Link>
          <Link
            href='#'
            className='text-white/80 hover:text-white transition-colors'>
            Hỗ trợ
          </Link>
        </div>
        <div className='flex items-center space-x-4'>
          <Link
            href='/login'
            className='hidden md:block px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors'>
            Đăng nhập
          </Link>
          <Link
            href='/register'
            className='px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-500 transition-colors'>
            Đăng ký
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className='relative'>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8'>
              <h1 className='fade-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400'>
                Trải nghiệm cá cược đẳng cấp
              </h1>
              <p className='fade-in opacity-0 translate-y-4 transition-all duration-700 delay-100 ease-out text-xl text-white/80 max-w-2xl'>
                Chào mừng đến với nền tảng game cá cược hàng đầu. Với hàng nghìn
                trò chơi hấp dẫn và cơ hội thắng thưởng khổng lồ.
              </p>
              <div className='fade-in opacity-0 translate-y-4 transition-all duration-700 delay-200 ease-out flex flex-wrap gap-4'>
                <Link
                  href='/login'
                  className='inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-105'>
                  Đăng nhập ngay
                  <ChevronRight className='ml-2 h-5 w-5' />
                </Link>
                <Link
                  href='/register'
                  className='inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105'>
                  Tạo tài khoản mới
                </Link>
              </div>
              <div className='fade-in opacity-0 translate-y-4 transition-all duration-700 delay-300 ease-out flex items-center space-x-4 text-white/60'>
                <div className='flex -space-x-2'>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className='w-8 h-8 rounded-full border-2 border-gray-800 bg-gradient-to-r from-pink-500 to-purple-500'
                    />
                  ))}
                </div>
                <span>Hơn 10,000+ người chơi đang trực tuyến</span>
              </div>
            </div>
            <div className='fade-in opacity-0 translate-y-4 transition-all duration-700 delay-400 ease-out hidden lg:block relative'>
              <div className='relative w-full aspect-square max-w-md mx-auto'>
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-600/20 to-purple-600/20 backdrop-blur-lg border border-white/10 shadow-xl transform rotate-6'></div>
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-600/30 to-purple-600/30 backdrop-blur-lg border border-white/10 shadow-xl transform -rotate-3'></div>
                <div className='relative rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 shadow-xl p-6 aspect-square'>
                  <div className='h-full flex flex-col justify-between'>
                    <div className='mb-4'>
                      <h3 className='text-2xl font-bold mb-2'>
                        Thống kê của bạn
                      </h3>
                      <p className='text-white/60'>
                        Chơi game. Thắng lớn. Lặp lại.
                      </p>
                    </div>
                    <div className='space-y-4'>
                      <div className='p-4 rounded-lg bg-white/5 flex items-center justify-between'>
                        <span>Số dư hiện tại</span>
                        <span className='font-bold text-xl text-primary-400'>
                          $0.00
                        </span>
                      </div>
                      <div className='p-4 rounded-lg bg-white/5 flex items-center justify-between'>
                        <span>Các trò chơi</span>
                        <span className='font-bold text-xl'>1,000+</span>
                      </div>
                      <div className='p-4 rounded-lg bg-white/5 flex items-center justify-between'>
                        <span>Giải thưởng</span>
                        <span className='font-bold text-xl text-primary-400'>
                          $100K+
                        </span>
                      </div>
                      <button className='w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-500 font-medium transition-colors'>
                        Bắt đầu chơi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Tại sao chọn nền tảng của chúng tôi?
            </h2>
            <p className='text-white/60 max-w-2xl mx-auto'>
              Khám phá những tính năng độc đáo giúp nền tảng của chúng tôi trở
              thành lựa chọn hàng đầu cho người chơi
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <FeatureCard
              icon={<Shield className='h-10 w-10 text-primary-400' />}
              title='An toàn & Bảo mật'
              description='Hệ thống bảo mật đa lớp đảm bảo thông tin cá nhân và giao dịch của bạn luôn được an toàn.'
            />
            <FeatureCard
              icon={<Sparkles className='h-10 w-10 text-primary-400' />}
              title='Đa dạng trò chơi'
              description='Hơn 1000+ trò chơi đa dạng từ các nhà phát triển hàng đầu thế giới, cập nhật thường xuyên.'
            />
            <FeatureCard
              icon={<TrendingUp className='h-10 w-10 text-primary-400' />}
              title='Tỷ lệ thắng cao'
              description='Tỷ lệ thắng hấp dẫn cùng hệ thống thanh toán nhanh chóng, giúp tối đa hóa trải nghiệm của bạn.'
            />
            <FeatureCard
              icon={<Users className='h-10 w-10 text-primary-400' />}
              title='Cộng đồng sôi động'
              description='Tham gia cộng đồng người chơi đông đảo, giao lưu và chia sẻ chiến thuật cùng nhau.'
            />
            <FeatureCard
              icon={<Gamepad2 className='h-10 w-10 text-primary-400' />}
              title='Giao diện trực quan'
              description='Thiết kế hiện đại, tương thích với mọi thiết bị, mang đến trải nghiệm chơi game mượt mà.'
            />
            <FeatureCard
              icon={<Sparkles className='h-10 w-10 text-primary-400' />}
              title='Khuyến mãi hấp dẫn'
              description='Thường xuyên cập nhật các chương trình khuyến mãi, thưởng nạp lần đầu và nhiều ưu đãi khác.'
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 p-8 md:p-12'>
            <div className='absolute top-0 left-0 w-full h-full opacity-20'>
              <div
                className='absolute inset-0'
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.3" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
                  backgroundSize: '20px 20px',
                }}></div>
            </div>
            <div className='relative z-10 flex flex-col md:flex-row items-center justify-between'>
              <div className='mb-6 md:mb-0 md:mr-8'>
                <h2 className='text-2xl md:text-3xl font-bold mb-2'>
                  Sẵn sàng bắt đầu trải nghiệm?
                </h2>
                <p className='text-white/80 max-w-xl'>
                  Đăng ký ngay hôm nay để nhận thưởng chào mừng và bắt đầu cuộc
                  phiêu lưu cá cược đầy hứng khởi.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  href='/login'
                  className='px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-white/90 transition-colors text-center'>
                  Đăng nhập
                </Link>
                <Link
                  href='/register'
                  className='px-6 py-3 rounded-lg bg-gray-900/20 backdrop-blur-sm border border-white/20 font-medium hover:bg-gray-900/40 transition-colors text-center'>
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='relative border-t border-white/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center mb-4'>
                <Gamepad2 className='h-6 w-6 text-primary-500 mr-2' />
                <span className='font-bold text-lg'>GameZone</span>
              </div>
              <p className='text-white/60 mb-4'>
                Nền tảng game cá cược hàng đầu, mang đến trải nghiệm giải trí
                đỉnh cao.
              </p>
              <div className='flex space-x-4'>
                <a
                  href='#'
                  className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'>
                  <span className='sr-only'>Facebook</span>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'>
                    <path
                      fillRule='evenodd'
                      d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
                <a
                  href='#'
                  className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'>
                  <span className='sr-only'>Twitter</span>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'>
                    <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'>
                  <span className='sr-only'>Instagram</span>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'>
                    <path
                      fillRule='evenodd'
                      d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className='font-semibold text-lg mb-4'>Liên kết nhanh</h3>
              <ul className='space-y-2 text-white/60'>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Trò chơi phổ biến
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Khuyến mãi mới
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-lg mb-4'>Hỗ trợ</h3>
              <ul className='space-y-2 text-white/60'>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Hướng dẫn
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Chính sách
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Bảo mật
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-lg mb-4'>Thông tin liên hệ</h3>
              <ul className='space-y-3 text-white/60'>
                <li className='flex items-start'>
                  <span className='mr-2'>📍</span>
                  <span>123 Đường Game, Quận Game, TP. Game</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>📱</span>
                  <span>+84 123 456 789</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>✉️</span>
                  <span>support@gamezone.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm'>
            <p>© 2025 GameZone. Tất cả các quyền được bảo lưu.</p>
            <p className='mt-2'>
              Website này chỉ dành cho người lớn từ 18 tuổi trở lên. Chơi có
              trách nhiệm.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile menu button (appears on small screens) */}
      <div className='fixed bottom-4 right-4 md:hidden z-50'>
        <button className='bg-primary-600 text-white rounded-full p-4 shadow-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>

      {/* Add Tailwind CSS */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1'>
      <div className='p-3 rounded-lg bg-white/5 inline-block mb-4'>{icon}</div>
      <h3 className='text-xl font-semibold mb-3'>{title}</h3>
      <p className='text-white/60'>{description}</p>
    </div>
  )
}
