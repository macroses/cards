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

    if (!Array.isArray(sets)) {
      throw createError({
        statusCode: 400,
        message: 'Неверный формат данных сетов',
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

    // Валидация данных сетов
    const validSets = sets.map((set: UserTrainingSession) => ({
      workoutId,
      exerciseId: set.exerciseId,
      weight: Number(set.weight) || 0,
      repeats: Number(set.repeats) || 0,
      difficulty: Number(set.difficulty) || 1,
      completed: Boolean(set.completed),
      setTime: set.setTime ? Number(set.setTime) : null,
      setTimeAddedAt: set.setTimeAddedAt ? new Date(set.setTimeAddedAt) : null,
    }))

    // Обновляем тренировку и все сеты
    const updatedWorkout = await event.context.prisma.$transaction(async (tx) => {
      // Удаляем старые сеты
      await tx.workoutSet.deleteMany({
        where: { workoutId },
      })

      // Создаем новые сеты
      await tx.workoutSet.createMany({
        data: validSets,
      })

      return tx.workout.update({
        where: { id: workoutId },
        data: {
          endedAt: new Date(),
          completed: completed || true,
        },
        include: {
          exercises: true,
          sets: true,
        },
      })
    })

    return updatedWorkout
  }
  catch (error: any) {
    console.error('Error in finishWorkout:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при завершении тренировки',
    })
  }
})
