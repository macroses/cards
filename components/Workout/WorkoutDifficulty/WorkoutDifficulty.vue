<script setup lang="ts">
import { WORKOUT_DIFFICULTY } from '~/constants/workout'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

const emit = defineEmits<{
  (event: 'difficultyChange', difficulty: DIFFICULT_LEVEL): void
}>()

const difficulty = defineModel<DIFFICULT_LEVEL>({
  default: DIFFICULT_LEVEL.WARM,
})

function handleDifficultyChange(level: DIFFICULT_LEVEL) {
  difficulty.value = level
  emit('difficultyChange', level)
}
</script>

<template>
  <div
    v-tooltip="'Сложность'"
    :data-difficulty="difficulty"
    class="difficulty-buttons"
  >
    <button
      v-for="level in WORKOUT_DIFFICULTY"
      :key="level.value"
      type="button"
      class="difficulty-button"
      :class="{ active: difficulty === level.value }"
      @click="handleDifficultyChange(level.value)"
    >
      {{ level.label }}
    </button>
  </div>
</template>

<style src="./style.css" />
