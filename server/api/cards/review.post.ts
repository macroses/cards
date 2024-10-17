import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { calculateNextReview } from '~/utils/spacedRepetition'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { cardId, quality } = body

  if (!cardId || quality === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Требуется ID карточки и оценка качества ответа',
    })
  }

  try {
    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Карточка не найдена',
      })
    }

    const { nextInterval, newEaseFactor } = calculateNextReview(card.easeFactor, card.interval, quality)
    const now = dayjs()
    const nextReviewAt = now.add(nextInterval, 'day')

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        lastReviewedAt: now.toDate(),
        nextReviewAt: nextReviewAt.toDate(),
        reviewCount: card.reviewCount + 1,
        easeFactor: newEaseFactor,
        interval: nextInterval,
      },
    })

    return updatedCard
  }
  catch (error) {
    console.error('Ошибка при обновлении карточки:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при обновлении карточки',
    })
  }
})
