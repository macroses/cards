import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const moduleId = event.context.params?.id
  const body = await readBody(event)

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID модуля обязателен',
    })
  }

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Новое название модуля обязательно',
    })
  }

  try {
    return await prisma.module.update({
      where: { id: moduleId },
      data: {
        name: body.name,
        description: body.description,
      },
    })
  }
  catch (error) {
    console.error('Ошибка при обновлении модуля:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при обновлении модуля',
    })
  }
})
