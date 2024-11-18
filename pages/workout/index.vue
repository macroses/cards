<script setup lang="ts">
import { useToggleCalendar } from '~/composables/calendar/useToggleCalendar'
import { WORKOUT_COLORS } from '~/constants'
import type { UserWorkout, UserWorkoutExercise } from '~/ts/interfaces'

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

function handleSelectExercise(exercise: UserWorkoutExercise) {
  const isExerciseExists = workout.exercises.some((ex: UserWorkoutExercise) => ex.id === exercise.id)

  if (!isExerciseExists) {
    workout.exercises.push(exercise)
  }
}

function handleRemoveExercise(exerciseId: number) {
  workout.exercises = workout.exercises.filter((exercise: UserWorkoutExercise) => exercise.id !== exerciseId)
}

watch(selectedDate, (newDate: Date) => {
  workout.workoutDate = new Date(newDate.setHours(12, 0, 0, 0))
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
        :selected-exercises="workout.exercises"
        @remove-exercise="handleRemoveExercise"
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
