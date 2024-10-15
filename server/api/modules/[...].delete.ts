import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const moduleId = event.context.params?._.split('/')[0]

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID модуля обязателен',
    })
  }

  try {
    await prisma.module.delete({
      where: { id: moduleId },
    })
    return { message: 'Модуль успешно удален' }
  }
  catch (error) {
    console.error('Ошибка при удалении модуля:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при удалении модуля',
    })
  }
})
