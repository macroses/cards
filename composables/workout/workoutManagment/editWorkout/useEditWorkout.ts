import type { LocationQuery } from '#vue-router'
import type { UserWorkout, WorkoutResponse } from '~/ts'
import { nanoid } from 'nanoid'
import { KEYS } from '~/constants'

/**
 * Composable for editing workouts.
 * Initializes edit mode, populates form with existing workout data.
 */

type EditWorkoutReturn = Readonly<{
  editableWorkout: ComputedRef<WorkoutResponse | null | undefined>
  initEditMode: () => Promise<void>
}>

export function useEditWorkout(workout: UserWorkout): EditWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<WorkoutResponse[]>(KEYS.GLOBAL_WORKOUTS)
  const workoutEditId = ref<LocationQuery | null>(null)
  const { selectExercise } = useSelectExercise()

  const editableWorkout = computed(() => {
    if (!workoutEditId.value?.edit) {
      return null
    }

    return workoutsList.value?.find(({ id }) => id === workoutEditId.value?.edit)
  })

  watch(editableWorkout, async (foundWorkout) => {
    if (!foundWorkout) {
      return
    }

    workout.title = foundWorkout.title
    workout.color = foundWorkout.color
    workout.workoutDate = new Date(foundWorkout.workoutDate)

    foundWorkout.exercises.forEach((exercise) => {
      selectExercise({
        id: exercise.exerciseId,
        name: exercise.exerciseName || '',
      }, workout).then()
    })

    foundWorkout.sets.forEach((set) => {
      workout.sessions.push({
        id: nanoid(),
        exerciseId: set.exerciseId,
        weight: set.weight,
        repeats: set.repeats,
        difficulty: set.difficulty,
        completed: set.completed,
        setTime: set.setTime || null,
      })
    })
  })

  async function initEditMode() {
    workoutEditId.value = route.query
  }

  return {
    editableWorkout,
    initEditMode,
  }
}
