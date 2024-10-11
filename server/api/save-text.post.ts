import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, userId } = body

  if (!text || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Текст и ID пользователя обязательны',
    })
  }

  try {
    return await prisma.userText.create({
      data: {
        text,
        userId,
      },
    })
  } catch (error) {
    console.error('Ошибка при сохранении текста:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при сохранении текста',
    })
  }
})