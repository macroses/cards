<script setup lang="ts">
import type { LocationQuery } from '#vue-router'
import { GLOBAL_WORKOUTS, WORKOUT_COLORS } from '~/constants'
import type { CreateWorkoutResponse, UserTrainingSession, UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

const { t } = useI18n()
const route = useRoute()

const {
  isCalendarVisible,
  toggleCalendar,
  selectedDate,
} = useToggleCalendar()

const { submitWorkout } = useSubmitWorkout()
const workoutsList = useState<CreateWorkoutResponse[] | []>(GLOBAL_WORKOUTS)
// const { fetchWorkoutById, data: fetchedWorkout, error, isLoading } = useFetchWorkoutById()

// User workout object
const workout = reactive<UserWorkout>({
  title: '',
  color: WORKOUT_COLORS[0].rgb,
  exercises: [],
  sessions: [],
  workoutDate: selectedDate.value,
})

const workoutEditId = ref<LocationQuery | null>(null)

function handleSelectExercise(exercise: UserWorkoutExercise): void {
  const isExerciseExists = workout.exercises.some((ex: UserWorkoutExercise) => ex.id === exercise.id)

  if (!isExerciseExists) {
    workout.exercises.push(exercise)
  }
}

function handleRemoveExercise(exerciseId: number): void {
  workout.exercises = workout.exercises.filter((exercise: UserWorkoutExercise) => exercise.id !== exerciseId)

  // Delete all sets, which relations to exercise
  workout.sessions = workout.sessions.filter((session: UserTrainingSession) => session.exerciseId !== exerciseId)
}

function handleAddSet(set: UserTrainingSession) {
  workout.sessions.push(set)
}

function handleRemoveSet(setId: string) {
  workout.sessions = workout.sessions.filter((session: UserTrainingSession) => session.id !== setId)
}

watch(selectedDate, (newDate: Date) => {
  workout.workoutDate = new Date(newDate.setHours(12, 0, 0, 0))
})

const editableWorkout = computed(() => {
  if (!workoutEditId.value?.edit)
    return null

  return workoutsList.value?.find((workout: CreateWorkoutResponse) => workout.id === workoutEditId.value?.edit)
})

watch(editableWorkout, (foundWorkout) => {
  if (!foundWorkout)
    return

  // Заполняем форму данными из найденной тренировки
  workout.title = foundWorkout.title
  workout.color = foundWorkout.color
  workout.workoutDate = new Date(foundWorkout.workoutDate)

  // Добавляем упражнения
  foundWorkout.exercises.forEach((exercise) => {
    handleSelectExercise({
      id: exercise.exerciseId,
      name: exercise.exerciseName || '',
    })
  })

  // Добавляем сеты
  foundWorkout.sets.forEach((set) => {
    handleAddSet({
      id: crypto.randomUUID(),
      exerciseId: set.exerciseId,
      weight: set.weight,
      repeats: set.repeats,
      difficulty: set.difficulty,
    })
  })
})

onMounted(() => {
  workoutEditId.value = route.query
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
      {{ workout }}
      <div v-auto-animate>
        <WorkoutDescription
          :selected-date="selectedDate"
          @workout-title="workout.title = $event"
          @workout-color="workout.color = $event"
          @toggle-calendar="toggleCalendar"
        />
        <Calendar
          v-if="isCalendarVisible"
          v-model="selectedDate"
        />
      </div>
    </template>
    <template #workout-exercises>
      <WorkoutExercises
        :sessions="workout.sessions"
        :selected-exercises="workout.exercises"
        @remove-exercise="handleRemoveExercise"
        @add-set="handleAddSet"
        @remove-set="handleRemoveSet"
      />
      <TheButton
        :disabled="!workout.title"
        @click="submitWorkout(workout)"
      >
        {{ t('workout.save_workout') }}
      </TheButton>
    </template>
    <template #exercises-list>
      <ExercisesList
        :selected-exercises="workout.exercises"
        @select-exercise="handleSelectExercise"
      />
    </template>
  </WorkoutWrapper>
</template>
