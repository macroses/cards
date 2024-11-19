const API_CHECK_WORKOUT = '/api/workout/checkAccess'

export function useCheckWorkoutAccess() {
  const route = useRoute()

  async function checkWorkoutAccess() {
    if (!route.query.edit)
      return

    try {
      await $fetch(API_CHECK_WORKOUT, {
        query: { id: route.query.edit },
      })
    }
    catch (error: any) {
      throw showError({
        statusCode: error.statusCode || 404,
        message: error.message || 'Тренировка не найдена',
      })
    }
  }

  return {
    checkWorkoutAccess,
  }
}
