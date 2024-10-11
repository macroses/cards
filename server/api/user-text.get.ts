import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  try {
    return await prisma.userText.findMany({
      where: {userId},
      orderBy: {createdAt: 'desc'},
    })
  } catch (error) {
    console.error('Error fetching user texts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching user texts',
    })
  }
})