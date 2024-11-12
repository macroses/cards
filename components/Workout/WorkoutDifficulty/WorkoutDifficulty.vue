<script setup lang="ts">
import { WORKOUT_DIFFICULTY } from '~/constants/workout'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

const difficulty = defineModel<DIFFICULT_LEVEL>({
  default: DIFFICULT_LEVEL.WARM,
})
</script>

<template>
  <div
    class="difficulty-buttons"
    :data-difficulty="difficulty"
  >
    <button
      v-for="level in WORKOUT_DIFFICULTY"
      :key="level.value"
      type="button"
      class="difficulty-button"
      :class="{ active: difficulty === level.value }"
      @click="difficulty = level.value"
    >
      {{ level.label }}
    </button>
  </div>
</template>

<style src="./style.css" />
