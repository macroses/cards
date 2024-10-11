import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const moduleId = query.moduleId as string

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    })
  }

  try {
    return await prisma.card.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error while fetching cards: ', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error while fetching cards',
    })
  }
})