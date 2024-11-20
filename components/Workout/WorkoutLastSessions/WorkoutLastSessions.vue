<script setup lang="ts">
interface WorkoutLastSessionProps {
  exerciseId: number
  activeExerciseId: number | null
  workoutDate: Date
}

const props = defineProps<WorkoutLastSessionProps>()

const { lastSets, fetchLastSets } = useLastExerciseSets()

watch(() => props.activeExerciseId, async (newId) => {
  if (newId) {
    await fetchLastSets(newId, props.workoutDate)
  }
})
</script>

<template>
  <div
    v-if="lastSets.length && activeExerciseId === exerciseId"
    class="previous-results"
  >
    <div class="previous-results__title">
      Предыдущие результаты:
    </div>
    <ul class="previous-results__list">
      <li
        v-for="set in lastSets"
        :key="set.id"
        class="previous-results__item"
      >
        <div
          class="workout-form__sets--difficulty"
          :data-difficulty="set.difficulty"
        />
        <div class="workout-form__sets--weight">
          {{ set.weight }}
        </div>
        <div class="workout-form__sets--repeats">
          {{ set.repeats }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style src='./style.css' />
