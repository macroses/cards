<script setup lang="ts">
import { useToggleCalendar } from '~/composables/calendar/useToggleCalendar'
import { WORKOUT_COLORS } from '~/constants'
import type { UserTrainingSession, UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

const { t } = useI18n()

const {
  isCalendarVisible,
  toggleCalendar,
  selectedDate,
} = useToggleCalendar()

// User workout object
const workout = reactive<UserWorkout>({
  title: '',
  color: WORKOUT_COLORS[0].rgb,
  exercises: [],
  sessions: [],
  workoutDate: selectedDate.value,
})

function handleSelectExercise(exercise: UserWorkoutExercise): void {
  const isExerciseExists = workout.exercises.some((ex: UserWorkoutExercise) => ex.id === exercise.id)

  if (!isExerciseExists) {
    workout.exercises.push(exercise)
  }
}

function handleRemoveExercise(exerciseId: number): void {
  workout.exercises = workout.exercises.filter((exercise: UserWorkoutExercise) => exercise.id !== exerciseId)
}

function handleAddSet(set: UserTrainingSession) {
  workout.sessions.push(set)
}

watch(selectedDate, (newDate: Date) => {
  workout.workoutDate = new Date(newDate.setHours(12, 0, 0, 0))
})

watch(workout, () => {
  console.log(workout)
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
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
        :selected-exercises="workout.exercises"
        @remove-exercise="handleRemoveExercise"
        @add-set="handleAddSet"
      />
      <TheButton :disabled="!workout.title">
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
