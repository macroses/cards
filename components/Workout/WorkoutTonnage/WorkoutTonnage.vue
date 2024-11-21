<script setup lang="ts">
import type { UserTrainingSession } from '~/ts/interfaces'

const props = defineProps<{
  sessions: UserTrainingSession[]
  selectedExercisesLength: number
}>()

const { t } = useI18n()

const totalTonnage = computed(() => {
  return `${t('workout.total_tonnage')}: ${(calculateTonnage(props.sessions)).toFixed(2)} T`
})
</script>

<template>
  <div
    v-auto-animate
    class="workout-exercises__top"
  >
    <div
      v-if="calculateTonnage(sessions) > 0"
      class="workout-total"
    >
      {{ totalTonnage }}
    </div>
  </div>
</template>
