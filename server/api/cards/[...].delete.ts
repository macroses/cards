import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const cardId = event.context.params?._.split('/')[0]

  if (!cardId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID карточки обязателен',
    })
  }

  try {
    await prisma.card.delete({
      where: { id: cardId },
    })
    return { message: 'Карточка успешно удалена' }
  } catch (error) {
    console.error('Ошибка при удалении карточки:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при удалении карточки',
    })
  }
})