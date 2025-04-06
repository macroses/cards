<script setup lang="ts">
import type { UserTrainingSession, UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'
import ExercisesList from '@/components/Exercises/ExerrcisesList/ExercisesList.vue'
import MyExercises from '@/components/Exercises/MyExercises/MyExercises.vue'
import TheLoader from '~/components/ui/TheLoader/TheLoader.vue'
import { useSelectExercise } from '~/composables/workoutManagment/useSelectExercise'
import { WORKOUT_COLORS } from '~/constants'

definePageMeta({
  middleware: [
    'workout-access',
    'auth',
  ],
})

const {
  isCalendarVisible,
  toggleCalendar,
  selectedDate,
} = useToggleCalendar()

const { submitWorkout } = useSubmitWorkout()

const workout = reactive<UserWorkout>({
  title: '',
  color: WORKOUT_COLORS[0].rgb,
  exercises: [],
  sessions: [],
  workoutDate: new Date(selectedDate.value.setHours(12, 0, 0, 0)),
  startedAt: null,
  endedAt: null,
  completed: false,
})

const { editableWorkout, initEditMode } = useEditWorkout(workout)
const { selectExercise } = useSelectExercise()
const { getLastSets } = useLastExerciseSets()
const { exercisesList, status } = useFetchExercisesList()

const isExercisesList = shallowRef(true)

async function handleSelectExercise(exercise: UserWorkoutExercise): Promise<void> {
  if (!document.startViewTransition) {
    await selectExercise(exercise, workout)
    return
  }

  const transition = document.startViewTransition(async () => {
    await nextTick()
    await selectExercise(exercise, workout)
  })

  await transition.finished
}

function handleRemoveExercise(exerciseId: string): void {
  workout.exercises = workout.exercises.filter((exercise: UserWorkoutExercise) => exercise.id !== exerciseId)
  workout.sessions = workout.sessions.filter((session: UserTrainingSession) => session.exerciseId !== exerciseId)
}

function handleAddSet(set: UserTrainingSession) {
  const sessionSet: UserTrainingSession = {
    ...set,
    setTime: set.setTime ? Number(set.setTime) : null,
    setTimeAddedAt: null,
  }

  workout.sessions.push(sessionSet)
}

function handleRemoveSet(setId: string) {
  workout.sessions = workout.sessions.filter((session: UserTrainingSession) => session.id !== setId)
}

const isWorkoutValid = computed(() => {
  if (!workout.exercises.length) {
    return
  }

  const exercisesWithSets = workout.exercises.some((exercise) => {
    return workout.sessions.some(session => session.exerciseId === exercise.id)
  })

  return exercisesWithSets && workout.title
})

const chosenExercisesList = computed(() => {
  return isExercisesList.value ? ExercisesList : MyExercises
})

watch(selectedDate, (newDate: Date) => {
  workout.workoutDate = new Date(newDate.setHours(12, 0, 0, 0))

  for (const exercise of workout.exercises) {
    getLastSets(exercise.id, workout.workoutDate)
  }
})

onMounted(async () => {
  await initEditMode()
})

useHead({
  title: computed(() => 'Create workout'),
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
      <WorkoutDescription
        :selected-date="selectedDate"
        :title="editableWorkout?.title"
        :color="editableWorkout?.color"
        @workout-title="workout.title = $event"
        @workout-color="workout.color = $event"
        @toggle-calendar="toggleCalendar"
      />
      <Calendar
        v-if="isCalendarVisible"
        v-model="selectedDate"
      />
    </template>
    <template #workout-exercises>
      <WorkoutExercises
        :sessions="workout.sessions"
        :selected-exercises="workout.exercises"
        :workout-date="workout.workoutDate"
        @remove-exercise="handleRemoveExercise"
        @add-set="handleAddSet"
        @remove-set="handleRemoveSet"
      />
      <TheButton
        :disabled="!isWorkoutValid"
        @click="submitWorkout(workout)"
      >
        {{ $t('workout.save_workout') }}
      </TheButton>
    </template>
    <template #exercises-list>
      <div class="muscles-list">
        <div class="tabs-container">
          <TheButton
            :variant="isExercisesList ? 'primary' : 'secondary'"
            @click="isExercisesList = true"
          >
            All exercises
          </TheButton>
          <TheButton
            :variant="isExercisesList ? 'secondary' : 'primary'"
            @click="isExercisesList = false"
          >
            My exercises
          </TheButton>
        </div>
        <TheLoader v-if="status !== 'success'" />
        <Component
          :is="chosenExercisesList"
          v-else
          :selected-exercises="workout.exercises"
          :exercises-list="exercisesList"
          @remove-exercise="handleRemoveExercise"
          @select-exercise="handleSelectExercise"
        />
      </div>
    </template>
  </WorkoutWrapper>
</template>
