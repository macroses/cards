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
    const { setId, timestamp } = await readBody(event)

    if (!setId || typeof timestamp !== 'number') {
      throw createError({
        statusCode: 400,
        message: 'Некорректные данные',
      })
    }

    const formattedTime = new Date(timestamp).toISOString()

    const set = await event.context.prisma.workoutSet.update({
      where: { id: setId },
      data: { setTime: formattedTime },
    })

    return set
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при обновлении времени сета',
    })
  }
})
