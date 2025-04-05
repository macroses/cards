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
  <main>
    <div class="container">
      <TheAside
        :is-charts-control-visible="isChartControlVisible"
      />
      <slot />
    </div>
  </main>
</template>

<style>
.container {
  max-width: 625px;
  margin: 0 auto;
  padding-inline: 16px;
  display: grid;
  grid-template-columns: 56px 1fr;
  position: relative;
  gap: 16px;

  &:has(.dashboard__charts) {
    max-width: 100%;
    gap: 16px;
    height: 100%;
  }

  &:not(:has(.home-page__container)) {
    max-width: 100%;
  }

  &:has(.workout) {
    height: 100%;
  }
}

main {
  padding-top: 16px;
  min-height: 100vh;

  &:not(:has(.dashboard__charts)) {
    padding-top: 40px;
    height: 100vh;
  }

  &:has(.workout) {
    padding-top: 16px;
  }
}
</style>
