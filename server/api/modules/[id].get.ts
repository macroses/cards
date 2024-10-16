// server/api/modules/[id].get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const moduleId = event.context.params?.id

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID модуля обязателен',
    })
  }

  try {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    })

    if (!module) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Модуль не найден',
      })
    }

    return module
  }
  catch (error) {
    console.error('Ошибка при получении модуля:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении модуля',
    })
  }
})
