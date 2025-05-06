<script setup lang="ts">
import type { WorkoutLastSessionProps } from '~/ts/componentProps'

defineProps<WorkoutLastSessionProps>()
</script>

<template>
  <div
    v-once
    class="previous-results"
  >
    <div class="previous-results__title">
      {{ $t('workout.previous_results') }}
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
