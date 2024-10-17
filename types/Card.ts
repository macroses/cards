export interface Card {
  id: string
  question: string
  answer: string
  title: string
  tags: string
  partOfSpeech: string
  exampleSentence: string
  moduleId: string
  createdAt: string
  lastReviewedAt: string | null
  nextReviewAt: string | null
  reviewCount: number
  easeFactor: number
  interval: number
}
