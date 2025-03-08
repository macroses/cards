import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'
import type { CreateWorkoutRequest } from '~/ts/interfaces'

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

    const body = await readBody<CreateWorkoutRequest & { id: string }>(event)

    // Удаляем все сразу
    const workout = await prisma.$transaction(async (tx) => {
      await tx.workoutExercise.deleteMany({
        where: { workoutId: body.id },
      })

      await tx.workoutSet.deleteMany({
        where: { workoutId: body.id },
      })

      // Обновляем тренировку с новыми данными
      return tx.workout.update({
        where: { id: body.id },
        data: {
          title: body.title,
          color: body.color,
          workoutDate: body.workoutDate,
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
              completed: set.completed,
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
      message: error.message || 'Ошибка при обновлении тренировки',
    })
  }
})
