<script setup lang="ts">
import type { UserWorkout } from '~/ts/interfaces'
import { KEYS } from '@/constants'

const { fetchWorkouts } = useFetchWorkoutsByUserId()
const { checkActiveWorkout } = useWorkoutTimer()
const { status } = useAuth()
const workouts = useState<UserWorkout[]>(KEYS.GLOBAL_WORKOUTS)

const isChartControlVisible: ComputedRef<boolean> = computed((): boolean => {
  if (!workouts.value) {
    return false
  }

  return workouts.value.filter(workout => workout.completed).length >= 5
})

watch(status, async (newStatus) => {
  if (newStatus === 'authenticated') {
    await fetchWorkouts()
    checkActiveWorkout(workouts.value)
  }
})

onMounted(async () => {
  await fetchWorkouts()
  checkActiveWorkout(workouts.value)
})
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

  @media (width <= 525px) {
    padding-left: 0;
  }
}
</style>
