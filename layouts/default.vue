<script setup lang="ts">
import type { UserWorkout } from '~/ts/interfaces'
import { KEYS } from '@/constants'

const { fetchWorkouts } = useFetchWorkoutsByUserId()
const { checkActiveWorkout } = useWorkoutTimer()
const { status } = useAuth()
const workouts = useState<UserWorkout[]>(KEYS.GLOBAL_WORKOUTS)

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
  <TheAside />
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
}

main {
  padding-top: 16px;
  padding-left: 58px;
}
</style>
