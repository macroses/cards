import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const cardId = event.context.params?._.split('/')[0]
  const body = await readBody(event)

  if (!cardId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID карточки обязателен',
    })
  }

  try {
    return await prisma.card.update({
      where: {id: cardId},
      data: body,
    })
  } catch (error) {
    console.error('Ошибка при обновлении карточки:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при обновлении карточки',
    })
  }
})