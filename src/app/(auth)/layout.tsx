// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>{children}</div>
      </div>
      <div className='relative hidden w-0 flex-1 lg:block'>
        <div className='absolute inset-0 h-full w-full bg-gradient-to-r from-primary-600 to-primary-800'>
          <div className='flex h-full items-center justify-center p-8'>
            <div className='text-center text-white'>
              <h2 className='text-4xl font-bold'>Game Platform</h2>
              <p className='mt-4 text-xl'>
                Chào mừng đến với nền tảng game của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
