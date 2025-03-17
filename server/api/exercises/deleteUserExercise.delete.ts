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
    const { id } = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID упражнения обязателен',
      })
    }

    // Проверяем существование и принадлежность упражнения пользователю
    const exercise = await event.context.prisma.userExercise.findUnique({
      where: { id },
    })

    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Упражнение не найдено',
      })
    }

    if (exercise.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        message: 'Нет доступа к этому упражнению',
      })
    }

    await event.context.prisma.userExercise.delete({
      where: { id },
    })

    return { success: true }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при удалении упражнения',
    })
  }
})
