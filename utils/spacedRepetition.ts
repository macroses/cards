export function calculateNextReview(easeFactor: number, interval: number, quality: number): {
  nextInterval: number
  newEaseFactor: number
} {
  const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  let nextInterval: number

  if (quality < 3) {
    nextInterval = 1
  }
  else if (interval === 0) {
    nextInterval = 1
  }
  else if (interval === 1) {
    nextInterval = 6
  }
  else {
    nextInterval = Math.round(interval * newEaseFactor)
  }

  return { nextInterval, newEaseFactor }
}
