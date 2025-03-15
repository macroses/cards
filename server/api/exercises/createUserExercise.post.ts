import { getServerSession } from '#auth'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Необходима авторизация',
    })
  }

  try {
    const body = await readBody<Omit<ExerciseServerTemplate, 'id'>>(event)

    const exercise = await event.context.prisma.userExercise.create({
      data: {
        userId: session.user.id,
        name: body.name,
        muscleId: body.muscleId,
        primary: body.primary,
        secondary: body.secondary.join(','), // Convert array to comma-separated string
        category: body.category,
        equipment: body.equipment,
        force: body.force,
        level: body.level,
      },
    })

    // Parse secondary muscles string back to array in response
    return {
      ...exercise,
      secondary: exercise.secondary.split(',').filter(Boolean),
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка при создании упражнения',
    })
  }
})
