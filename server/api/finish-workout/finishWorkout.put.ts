import type { UserTrainingSession } from '~/ts/interfaces'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  try {
    const { workoutId, completed, sets } = await readBody(event)

    if (!workoutId) {
      throw createError({
        statusCode: 400,
        message: 'ID тренировки обязателен',
      })
    }

    // Проверяем доступ к тренировке
    const workout = await event.context.prisma.workout.findUnique({
      where: { id: workoutId },
    })

    if (!workout) {
      throw createError({
        statusCode: 404,
        message: 'Тренировка не найдена',
      })
    }

    if (workout.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        message: 'Нет доступа к этой тренировке',
      })
    }

    if (!workout.startedAt) {
      throw createError({
        statusCode: 400,
        message: 'Тренировка не была начата',
      })
    }

    // Обновляем все сеты
    await event.context.prisma.$transaction(
      sets.map((set: UserTrainingSession) =>
        event.context.prisma.workoutSet.update({
          where: { id: set.id },
          data: {
            weight: set.weight || 0,
            repeats: set.repeats || 0,
            difficulty: set.difficulty,
            setTime: set.setTime,
            setTimeAddedAt: set.setTimeAddedAt,
          },
        }),
      ),
    )

    const updatedWorkout = await event.context.prisma.workout.update({
      where: { id: workoutId },
      data: {
        endedAt: new Date(),
        completed: completed || true,
      },
    })

    return updatedWorkout
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при завершении тренировки',
    })
  }
})
