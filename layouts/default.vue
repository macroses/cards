<script setup lang="ts">
import type { UserWorkout } from '~/ts/interfaces'
import { KEYS } from '@/constants'

const { fetchWorkouts, isChartControlVisible } = useFetchWorkoutsByUserId()
const { checkActiveWorkout } = useWorkoutTimer()
const { status } = useAuth()
const workouts = useState<UserWorkout[]>(KEYS.GLOBAL_WORKOUTS)

watch(status, async () => {
  await fetchWorkouts()
  checkActiveWorkout(workouts.value)
}, { immediate: true })
</script>

<template>
  <TheAside :is-charts-control-visible="isChartControlVisible" />
  <main>
    <div class="container">
      <slot />
    </div>
  </main>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: 16px;

  @media (width <= 1023px) {
    padding-inline: 8px;
  }

  @media (width <= 525px) {
    margin-bottom: 45px;
  }
}

main {
  padding-top: 16px;
  padding-left: 58px;

  @media (width <= 1023px) {
    padding-top: 8px;
  }

  @media (width <= 768px) {
    padding-left: 0;
  }
}
</style>
