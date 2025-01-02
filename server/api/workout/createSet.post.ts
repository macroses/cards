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
    const { workoutId, exerciseId, weight, repeats, difficulty } = await readBody(event)

    if (!workoutId || !exerciseId) {
      throw createError({
        statusCode: 400,
        message: 'Необходимо указать ID тренировки и упражнения',
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

    // Создаем новый сет
    const newSet = await event.context.prisma.workoutSet.create({
      data: {
        workoutId,
        exerciseId,
        weight: weight || 0,
        repeats: repeats || 0,
        difficulty: difficulty || 1,
        completed: false,
        setTime: null,
      },
    })

    return newSet
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при создании сета',
    })
  }
})
