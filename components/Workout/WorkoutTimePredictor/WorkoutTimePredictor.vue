<script setup lang="ts">
import type { CreateWorkoutResponse } from '~/ts/interfaces'

const props = defineProps<{
  workout: CreateWorkoutResponse | null
}>()

const { getRemainingTimeText } = useWorkoutPrediction()

const predictionText = ref<string | null>('')

function updatePrediction() {
  if (props.workout) {
    predictionText.value = getRemainingTimeText(props.workout)
  }
}

watch(() => props.workout?.sets, () => {
  updatePrediction()
}, { deep: true })

// Обновляем предсказание каждую минуту
let intervalId: ReturnType<typeof setInterval> | null = null

const REFRESH_INTERVAL = 60000

onMounted(() => {
  updatePrediction()
  intervalId = setInterval(updatePrediction, REFRESH_INTERVAL)
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div
    v-if="predictionText"
    class="workout-time-predictor"
  >
    <div class="predictor-icon">
      <TheIcon
        icon-name="clock"
        width="18px"
      />
    </div>
    <div class="predictor-text">
      {{ predictionText }}
    </div>
  </div>
</template>

<style scoped>

</style>
