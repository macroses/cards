<script setup lang="ts">
const { selectedExercisesList, fillExercisesList } = useSelectExercise()

useHead({
  title: 'Workout',
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
      <div v-auto-animate>
        <!--        <WorkoutDescription /> -->
        <!--        <Calendar /> -->
      </div>
    </template>
    <template #workout-exercises>
      <WorkoutExercises
        :selected-exercises="selectedExercisesList"
      />
    </template>
    <template #exercises-list>
      <ExercisesList
        :selected-exercises="selectedExercisesList"
        @select-exercise="fillExercisesList"
      />
    </template>
  </WorkoutWrapper>
</template>
