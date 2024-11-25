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
    class="workout-total"
    :class="{ visible: calculateTonnage(sessions) > 0 }"
  >
    {{ totalTonnage }}
  </div>
</template>
