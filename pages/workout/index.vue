<script setup lang="ts">
import { useExerciseManagement } from '~/composables/exerciseManagment/useExerciseManagment'
import { useWorkoutSets } from '~/composables/setsManagment/useSetsManagment'
import { useWorkout } from '~/composables/workout/useWorkout'
import type { Workout } from '~/types/Workout'

const { t } = useI18n()

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
const workout = reactive<Workout>({
  title: '',
  color: '213, 0, 0',
  exercises: [],
  workoutDate: new Date(selectedDate.value.setHours(12, 0, 0, 0)),
})

const {
  selectedExercisesList,
  activeExerciseId,
  exerciseData,
  selectExercise,
  removeExercise,
  toggleExercise,
} = useExerciseManagement({ workout })

const { addSet, removeSet } = useWorkoutSets(workout, exerciseData)
const { submitWorkout, isLoading } = useWorkout()

async function saveWorkout() {
  const success = await submitWorkout(workout)

  if (success && !isLoading.value) {
    navigateTo('/')
  }
}

useHead({
  title: 'Workout',
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
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
      <BodySvg />
      <div class="workout-actions">
        <TheButton @click="saveWorkout">
          {{ t('workout.save_workout') }}
        </TheButton>
      </div>
    </template>
    <template #exercises-list>
      <ExercisesList
        :selected-exercises="selectedExercisesList"
        @select-exercise="selectExercise"
      />
    </template>
  </WorkoutWrapper>
</template>
