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
    const { workoutId, newDate } = await readBody(event)

    // Получаем исходную тренировку
    const sourceWorkout = await event.context.prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        exercises: true,
        sets: true,
      },
    })

    if (!sourceWorkout) {
      throw createError({
        statusCode: 404,
        message: 'Тренировка не найдена',
      })
    }

    // Создаем копию тренировки с новой датой
    const copiedWorkout = await event.context.prisma.workout.create({
      data: {
        userId: session.user.id,
        title: sourceWorkout.title,
        color: sourceWorkout.color,
        workoutDate: new Date(newDate),
        exercises: {
          create: sourceWorkout.exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
          })),
        },
        sets: {
          create: sourceWorkout.sets.map(set => ({
            exerciseId: set.exerciseId,
            weight: set.weight,
            repeats: set.repeats,
            difficulty: set.difficulty,
            completed: set.completed,
          })),
        },
      },
      include: {
        exercises: true,
        sets: true,
      },
    })

    return copiedWorkout
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка при копировании тренировки',
    })
  }
})
