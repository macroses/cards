import type { ExerciseServerTemplate } from '~/ts/interfaces'

export function useExerciseHandle() {
  const exercises = ref<ExerciseServerTemplate[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchExercises = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<ExerciseServerTemplate[]>('/api/exercises/getUserExercises')
      exercises.value = response
      return response
    }
    catch (e) {
      error.value = 'Ошибка при загрузке упражнений'
      console.error(e)
    }
    finally {
      isLoading.value = false
    }
  }

  const createExercise = async (exercise: Omit<ExerciseServerTemplate, 'id'>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<ExerciseServerTemplate>('/api/exercises/createUserExercise', {
        method: 'POST',
        body: exercise,
      })

      exercises.value.push(response)
      return response
    }
    catch (e) {
      error.value = 'Ошибка при создании упражнения'
      console.error(e)
    }
    finally {
      isLoading.value = false
    }
  }

  // Fetch exercises when composable is initialized
  onMounted(async () => await fetchExercises())

  return {
    exercises,
    isLoading,
    error,
    createExercise,
    fetchExercises,
  }
}
