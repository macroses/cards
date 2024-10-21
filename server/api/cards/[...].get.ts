import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неавторизованный доступ',
    })
  }

  const query = getQuery(event)
  const moduleId = query.moduleId as string

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID модуля обязателен',
    })
  }

  try {
    const module = await prisma.module.findUnique({
      where: {
        id: moduleId,
        userId: session.user.id,
      },
    })

    if (!module) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Модуль не найден или у вас нет доступа к нему',
      })
    }

    return await prisma.card.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'desc' },
    })
  }
  catch (error) {
    console.error('Ошибка при получении карточек:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении карточек, хаха',
    })
  }
})
