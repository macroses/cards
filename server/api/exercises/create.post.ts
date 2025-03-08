import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const body = await readBody(event)

    const exercise = await prisma.userExercise.create({
      data: {
        userId: session.user.id,
        name: body.name,
        muscles: body.muscles as any, // Prisma ожидает Json тип
        characteristics: body.characteristics as any, // Prisma ожидает Json тип
        description: body.description || '',
      },
    })

    return exercise
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Error creating exercise',
    })
  }
})
