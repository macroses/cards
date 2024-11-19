<script setup lang="ts">
import { useSelectExercise } from '~/composables/workoutManagment/useSelectExercise'
import { WORKOUT_COLORS } from '~/constants'
import type { UserTrainingSession, UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

const { t } = useI18n()

const {
  isCalendarVisible,
  toggleCalendar,
  selectedDate,
} = useToggleCalendar()

const { submitWorkout } = useSubmitWorkout()

// User workout object
const workout = reactive<UserWorkout>({
  title: '',
  color: WORKOUT_COLORS[0].rgb,
  exercises: [],
  sessions: [],
  workoutDate: selectedDate.value,
})

const { editableWorkout, initEditMode } = useEditWorkout(workout)
const { selectExercise } = useSelectExercise()

function handleSelectExercise(exercise: UserWorkoutExercise): void {
  selectExercise(exercise, workout)
}

function handleRemoveExercise(exerciseId: number): void {
  workout.exercises = workout.exercises.filter((exercise: UserWorkoutExercise) => exercise.id !== exerciseId)
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

onMounted(async () => {
  await initEditMode()
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
      <div v-auto-animate>
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
