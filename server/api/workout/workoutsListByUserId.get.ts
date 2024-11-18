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
    return await event.context.prisma.workout.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        exercises: true,
        sets: true,
      },
      orderBy: {
        workoutDate: 'desc',
      },
    })
  }
  catch (error) {
    console.error('Ошибка при получении тренировок:', error)

    throw createError({
      statusCode: 500,
      message: 'Ошибка при получении тренировок',
    })
  }
})
