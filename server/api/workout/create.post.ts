import type { CreateWorkoutRequest } from '~/ts/interfaces'
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

    const body = await readBody<CreateWorkoutRequest>(event)

    const workout = await prisma.$transaction(async (tx) => {
      return tx.workout.create({
        data: {
          userId: session.user.id,
          title: body.title,
          color: body.color,
          workoutDate: body.workoutDate,
          completed: false,
          exercises: {
            create: body.exercises.map(exercise => ({
              exerciseId: exercise.id,
              exerciseName: exercise.name,
            })),
          },
          sets: {
            create: body.sessions.map(set => ({
              exerciseId: set.exerciseId,
              weight: set.weight || 0,
              repeats: set.repeats || 0,
              difficulty: set.difficulty,
              completed: set.completed || false,
              setTime: set.setTime || null,
            })),
          },
        },
        include: {
          exercises: true,
          sets: true,
        },
      })
    })

    return workout
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка при создании тренировки',
    })
  }
})
