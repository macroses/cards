import type { ExerciseTemplate } from '~/ts'
import { getServerSession } from '#auth'

const MAX_NAME_LENGTH = 50

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  try {
    const body = await readBody<Omit<ExerciseTemplate, 'id'>>(event)

    if (!body.name?.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Название упражнения обязательно',
      })
    }

    if (body.name.length > MAX_NAME_LENGTH) {
      throw createError({
        statusCode: 400,
        message: `Максимальная длина названия ${MAX_NAME_LENGTH} символов`,
      })
    }

    const exercise = await event.context.prisma.userExercise.create({
      data: {
        userId: session.user.id,
        name: body.name,
        muscleId: body.muscleId,
        primary: body.primary,
        secondary: body.secondary,
        category: body.category,
        equipment: body.equipment,
        force: body.force,
        level: body.level,
      },
    })

    // Parse secondary muscles string back to array in response
    return {
      ...exercise,
      secondary: exercise.secondary.filter(Boolean),
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при создании упражнения',
    })
  }
})
