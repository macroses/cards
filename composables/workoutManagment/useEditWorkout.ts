import type { LocationQuery } from '#vue-router'
import type { CreateWorkoutResponse, UserWorkout } from '~/ts/interfaces'
import { GLOBAL_WORKOUTS } from '~/constants'

type EditWorkoutReturn = Readonly<{
  editableWorkout: ComputedRef<CreateWorkoutResponse | null | undefined>
  initEditMode: () => Promise<void>
}>

export function useEditWorkout(workout: UserWorkout): EditWorkoutReturn {
  const route = useRoute()
  const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)
  const workoutEditId = ref<LocationQuery | null>(null)
  const { selectExercise } = useSelectExercise()

  const editableWorkout = computed(() => {
    if (!workoutEditId.value?.edit)
      return null

    return workoutsList.value?.find((workout: CreateWorkoutResponse) => workout.id === workoutEditId.value?.edit)
  })

  watch(editableWorkout, (foundWorkout) => {
    if (!foundWorkout)
      return

    workout.title = foundWorkout.title
    workout.color = foundWorkout.color
    workout.workoutDate = new Date(foundWorkout.workoutDate)

    foundWorkout.exercises.forEach(async (exercise) => {
      await selectExercise({
        id: exercise.exerciseId,
        name: exercise.exerciseName || '',
      }, workout)
    })

    foundWorkout.sets.forEach((set) => {
      workout.sessions.push({
        id: crypto.randomUUID(),
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
