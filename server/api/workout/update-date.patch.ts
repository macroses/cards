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
    const { id, newDate } = await readBody(event)

    if (!id || !newDate) {
      throw createError({
        statusCode: 400,
        message: 'ID тренировки и новая дата обязательны',
      })
    }

    await event.context.prisma.workout.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        workoutDate: new Date(newDate),
      },
    })

    return { success: true }
  }
  catch (error) {
    console.error('Ошибка при обновлении даты тренировки:', error)

    throw createError({
      statusCode: 500,
      message: 'Ошибка при обновлении даты тренировки',
    })
  }
})
