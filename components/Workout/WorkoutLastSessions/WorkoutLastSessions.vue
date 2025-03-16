<script setup lang="ts">
interface WorkoutLastSessionProps {
  exerciseId: string
  activeExerciseId: string | null
  workoutDate: Date
  showSessions: boolean
}

const props = defineProps<WorkoutLastSessionProps>()

const { t } = useI18n()
const { lastSets } = useLastExerciseSets()

const exerciseSets = computed(() => {
  return lastSets.value[props.exerciseId] || []
})
</script>

<template>
  <div
    v-if="exerciseSets.length && showSessions"
    class="previous-results"
  >
    <div class="previous-results__title">
      {{ t('workout.previous_results') }}
    </div>
    <ul class="previous-results__list">
      <li
        v-for="set in exerciseSets"
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
