import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { question, answer, title, tags, partOfSpeech, exampleSentence, moduleId } = body

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID модуля обязателен',
    })
  }

  try {
    const card = await prisma.card.create({
      data: {
        question,
        answer,
        title,
        tags,
        partOfSpeech,
        exampleSentence,
        moduleId,
      },
    })
    return card
  } catch (error) {
    console.error('Ошибка при создании карточки:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при создании карточки',
    })
  }
})