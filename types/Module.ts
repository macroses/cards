export interface Module {
  id: string
  name: string
  description?: string | null
  userId: string
  createdAt: string
  cardCount?: number
}
