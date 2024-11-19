import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const query = getQuery(event)
  const exerciseId = Number(query.exerciseId)
  const currentDate = query.currentDate ? new Date(query.currentDate as string) : new Date()

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  if (!exerciseId) {
    throw createError({
      statusCode: 400,
      message: 'ID упражнения обязателен',
    })
  }

  try {
    // Получаем последнюю тренировку с этим упражнением ДО текущей даты
    const lastWorkout = await event.context.prisma.workout.findFirst({
      where: {
        userId: session.user.id,
        exercises: {
          some: {
            exerciseId,
          },
        },
        workoutDate: {
          lt: currentDate,
        },
      },
      orderBy: {
        workoutDate: 'desc',
      },
      include: {
        sets: {
          where: {
            exerciseId,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    })

    return lastWorkout?.sets || []
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Ошибка при получении предыдущих результатов: ${error.message}`,
    })
  }
})
