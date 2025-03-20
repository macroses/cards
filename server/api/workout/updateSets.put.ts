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
    const { sets } = await readBody(event)

    if (!sets?.length) {
      throw createError({
        statusCode: 400,
        message: 'Необходимо передать массив сетов',
      })
    }

    // Обновляем все сеты одним запросом
    await event.context.prisma.$transaction(
      sets.map((set: UserTrainingSession) =>
        event.context.prisma.workoutSet.update({
          where: { id: set.id },
          data: {
            weight: set.weight || 0,
            repeats: set.repeats || 0,
            difficulty: set.difficulty,
          },
        }),
      ),
    )

    return { success: true }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при обновлении сетов',
    })
  }
})
