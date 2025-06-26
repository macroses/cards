import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  if (event.method === 'GET') {
    try {
      const exercises = await event.context.prisma.userExercise.findMany({
        where: {
          userId: session.user.id,
        },
      })

      // Parse secondary muscles string back to array
      return exercises.map(exercise => ({
        ...exercise,
        secondary: exercise.secondary,
      }))
    }
    catch (error: any) {
      throw createError({
        statusCode: 500,
        message: error.message || 'Ошибка при получении упражнений',
      })
    }
  }
})
