import { getServerSession } from '#auth'
import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'

export default defineEventHandler(async (event): Promise<CreateWorkoutResponse[]> => {
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
        exercises: {
          include: {
            sets: true,
          },
        },
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
