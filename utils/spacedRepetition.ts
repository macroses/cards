export function calculateNextReview(easeFactor: number, interval: number, quality: number): {
  nextInterval: number
  newEaseFactor: number
} {
  const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  let nextInterval: number

  switch (quality) {
    case 1:
      nextInterval = 1 / 24 // 1 час
      break
    case 2:
      nextInterval = 8 / 24 // 8 часов
      break
    case 3:
      nextInterval = 1 // 1 сутки
      break
    case 4:
      nextInterval = 36 / 24 // 36 часов
      break
    case 5:
      nextInterval = 2 // 48 часов
      break
    default:
      nextInterval = 1
  }

  return { nextInterval, newEaseFactor }
}
