import { getServerSession } from '#auth'
import type { CreateWorkoutRequest, CreateWorkoutResponse } from '~/types/CreateWorkout'

export default defineEventHandler(async (event): Promise<CreateWorkoutResponse> => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  try {
    const body = await readBody<CreateWorkoutRequest>(event)
    const { title, color, workoutDate, exercises } = body

    if (!title) {
      throw createError({
        statusCode: 400,
        message: 'Название тренировки обязательно',
      })
    }

    if (!exercises?.length) {
      throw createError({
        statusCode: 400,
        message: 'Добавьте хотя бы одно упражнение',
      })
    }

    return await event.context.prisma.workout.create({
      data: {
        userId: session.user.id,
        title,
        color,
        workoutDate: new Date(workoutDate),
        exercises: {
          create: exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            sets: {
              create: exercise.sets.map(set => ({
                weight: set.weight,
                repeats: set.repeats,
                difficulty: set.difficulty,
              })),
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    })
  }
  catch (error) {
    console.error('Ошибка при сохранении тренировки:', error)

    throw createError({
      statusCode: 500,
      message: 'Ошибка при сохранении тренировки',
    })
  }
})
