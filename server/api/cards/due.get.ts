import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const moduleId = query.moduleId as string

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID модуля обязателен',
    })
  }

  try {
    const now = dayjs()
    const dueCards = await prisma.card.findMany({
      where: {
        moduleId,
        OR: [
          { nextReviewAt: null },
          { nextReviewAt: { lte: now.toDate() } },
        ],
      },
      orderBy: [
        { nextReviewAt: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return dueCards
  }
  catch (error) {
    console.error('Ошибка при получении карточек для повторения:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении карточек для повторения',
    })
  }
})
