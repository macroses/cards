<script setup lang="ts">
import { useExerciseManagement } from '~/composables/exerciseManagment/useExerciseManagment'
import { useWorkoutSets } from '~/composables/setsManagment/useSetsManagment'
import type { Workout } from '~/types/Workout'

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())

const {
  selectedExercisesList,
  activeExerciseId,
  exerciseData,
  selectExercise,
  removeExercise,
  toggleExercise,
} = useExerciseManagement()

const workout = reactive<Workout>({
  title: '',
  color: '213, 0, 0',
  exercises: [],
  workoutDate: new Date(selectedDate.value.setHours(12, 0, 0, 0)),
})

const { addSet, removeSet } = useWorkoutSets(workout, exerciseData)
</script>

<template>
  <WorkoutWrapper>
    <template #description>
      {{ workout }}
      <WorkoutDescription
        @workout-title="workout.title = $event"
        @workout-color="workout.color = $event"
      />
    </template>
    <template #workout-exercises>
      <WorkoutExercises
        :exercises="selectedExercisesList"
        :active-exercise-id="activeExerciseId"
        :exercise-data="exerciseData"
        :workout-exercises="workout.exercises"
        @toggle-exercise="toggleExercise"
        @remove-exercise="removeExercise"
        @add-set="addSet"
        @remove-set="removeSet"
      />
    </template>
    <template #exercises-list>
      <ExercisesList
        :selected-exercises="selectedExercisesList"
        @select-exercise="selectExercise"
      />
    </template>
  </WorkoutWrapper>
</template>
