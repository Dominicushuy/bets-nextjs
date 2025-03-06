// src/components/game/confetti-effect.ts
import confetti from 'canvas-confetti'

/**
 * Hiệu ứng confetti nhỏ từ 2 bên
 * @param duration Thời gian hiệu ứng (ms)
 */
export function smallConfettiEffect(duration = 3000) {
  const end = Date.now() + duration

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval)
      return
    }

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF0000', '#90EE90', '#1E90FF'],
    })

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF0000', '#90EE90', '#1E90FF'],
    })
  }, 150)
}

/**
 * Hiệu ứng confetti lớn ở giữa màn hình
 */
export function bigConfettiEffect() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: [
      '#FFD700',
      '#FFA500',
      '#FF4500',
      '#FF6347',
      '#FF0000',
      '#90EE90',
      '#1E90FF',
    ],
    shapes: ['circle', 'square'],
    scalar: 1.2,
  })
}

/**
 * Hiệu ứng confetti dành cho người thắng
 */
export function winnerConfettiEffect() {
  // Hiệu ứng nhỏ liên tục
  smallConfettiEffect(3000)

  // Hiệu ứng lớn sau 1 giây
  setTimeout(() => {
    bigConfettiEffect()
  }, 1000)

  // Hiệu ứng lớn thứ 2 sau 2 giây
  setTimeout(() => {
    bigConfettiEffect()
  }, 2000)
}

/**
 * Hiệu ứng firework
 */
export function fireworksEffect() {
  const duration = 5 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FF0000', '#FF4500'],
      })
    )

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00FF00', '#0000FF', '#FF00FF'],
      })
    )
  }, 250)
}
