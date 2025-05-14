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
  <div class="layout-gradient">
    <div />
    <div />
    <div />
    <div />
  </div>
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

.layout-gradient {
  position: fixed;
  inset: 0;
  z-index: -1;
  filter: blur(50px);
  background-color: #3a8bf7;
  opacity: 0.5;

  & div {
    position: absolute;

    &:first-child {
      width: 80%;
      aspect-ratio: 1;
      left: -30%;
      top: -30%;
      border-radius: 50%;
      background-color: #ebbf54;
    }

    &:nth-child(3) {
      width: 50%;
      aspect-ratio: 1;
      left: 0;
      bottom: -50%;
      border-radius: 50%;
      background-color: #ec70e8;
    }

    &:nth-child(4) {
      width: 50%;
      aspect-ratio: 1;
      right: 0;
      bottom: -30%;
      border-radius: 50%;
      background-color: #62c3ed;
    }
  }
}
</style>
