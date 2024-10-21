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

  const moduleId = event.context.params?.id

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
      },
    })

    if (!module) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Модуль не найден',
      })
    }

    if (module.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'У вас нет доступа к этому модулю',
      })
    }

    return module
  }
  catch (error) {
    console.error('Ошибка при получении модуля:', error)
    throw error
  }
})
