import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, userId, description } = body

  if (!name || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Folder name and user ID are required',
    })
  }

  try {
    return await prisma.module.create({
      data: {
        name,
        userId,
        description
      }
    })
  } catch (error) {
    console.error('Error creating folder:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating folder',
    })
  }
})