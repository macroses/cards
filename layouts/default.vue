<script setup lang="ts">
import type { UserWorkout } from '~/ts'
import { KEYS } from '@/constants'

const { fetchWorkouts, isChartControlVisible } = useFetchWorkoutsByUserId()
const { checkActiveWorkout } = useWorkoutTimer()
const { fetchExercises } = useExerciseHandle()
const workouts = useState<UserWorkout[]>(KEYS.GLOBAL_WORKOUTS)

onMounted(async () => {
  await fetchWorkouts()
  await fetchExercises()
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
