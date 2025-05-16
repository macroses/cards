<script setup lang="ts">
import type { UserWorkout } from '~/ts/interfaces'
import { KEYS } from '@/constants'

const { fetchWorkouts, isChartControlVisible } = useFetchWorkoutsByUserId()
const { checkActiveWorkout } = useWorkoutTimer()
const { status } = useAuth()
const workouts = useState<UserWorkout[]>(KEYS.GLOBAL_WORKOUTS)

watch(status, async () => {
  if (status.value === 'authenticated') {
    await fetchWorkouts()
    checkActiveWorkout(workouts.value)
  }
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
