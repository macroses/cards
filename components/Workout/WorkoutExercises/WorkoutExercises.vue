<script setup lang="ts">
import type { UserWorkoutExercise } from '~/ts/interfaces'

defineProps<{
  selectedExercises: UserWorkoutExercise[]
}>()

const emit = defineEmits<{
  (event: 'removeExercise', id: number): void
  (event: 'addSet', id: number): void
  (event: 'removeSet', id: number): void
}>()
</script>

<template>
  <div
    v-auto-animate
    class="workout-exercises-wrapper"
  >
    <ul
      v-if="selectedExercises.length"
      v-auto-animate
      class="workout__exercises"
    >
      <li
        v-for="exercise in selectedExercises"
        :key="exercise.id"
        class="workout__exercises-item"
      >
        <div
          class="workout__exercises-item-name"
        >
          <TheIcon
            icon-name="angle-down"
            width="14px"
            class="workout__exercises__title-icon"
          />
          <span>{{ exercise.name }}</span>
          <div class="workout__exercises-chart">
            <TheButton
              variant="transparent"
              icon-only
            >
              <TheIcon
                icon-name="chart-waterfall"
                width="14px"
              />
            </TheButton>
          </div>
          <TheButton
            variant="transparent"
            icon-only
            @click="emit('removeExercise', exercise.id)"
          >
            <TheIcon
              icon-name="xmark"
              width="14px"
            />
          </TheButton>
        </div>

        <div class="">
          <form
            v-auto-animate
            class="exercise-form"
            @submit.prevent="emit('addSet', exercise.id)"
          >
            <div class="exercise-form__main">
              <TheInput
                placeholder="Вес"
                type="number"
                inputmode="numeric"
                no-clear
              />
              <TheInput
                placeholder="Повторения"
                type="number"
                inputmode="numeric"
                no-clear
              />
            </div>
            <div class="exercise-form__submit">
              <WorkoutDifficulty />
              <TheButton
                type="submit"
              >
                Append
              </TheButton>
            </div>
          </form>
        </div>
      </li>
    </ul>
    <p
      v-else
      class="exercises-empty"
    >
      Add exercise
    </p>
  </div>
</template>

<style src="./style.css" />
