<script setup lang="ts">
const { runWorkout, initRunMode } = useRunWorkout()
const { endWorkout } = useFinishWorkout()

async function handleEndWorkout() {
  if (runWorkout.value) {
    const success = await endWorkout(runWorkout.value.id)

    if (success) {
      navigateTo('/')
    }
  }
}

onMounted(async () => await initRunMode())

// Добавим computed свойство для группировки сетов по упражнениям
const exerciseSets = computed(() => {
  if (!runWorkout.value) {
    return {}
  }

  return runWorkout.value.sets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = []
    }
    acc[set.exerciseId].push(set)
    return acc
  }, {} as Record<number, typeof runWorkout.value.sets>)
})
</script>

<template>
  <div
    v-if="runWorkout"
    class="run"
  >
    <button @click="handleEndWorkout">
      finish
    </button>
    <h1 class="run__title">
      {{ runWorkout.title }}
    </h1>
    <ul class="run__exercises-list">
      <li
        v-for="exercise in runWorkout.exercises"
        :key="exercise.exerciseId"
        class="run__exercise-item"
      >
        <div class="run__exercise">
          {{ exercise.exerciseName }}
        </div>
        <ul
          v-if="exerciseSets[exercise.exerciseId]?.length"
          class="run__sets"
        >
          <li
            v-for="set in exerciseSets[exercise.exerciseId]"
            :key="set.id"
            class="run__set-item"
          >
            <div
              class="run__set-difficulty"
            >
              {{ set.difficulty }}
            </div>
            <div class="run__set-weight">
              {{ set.weight }}
            </div>
            <div class="run__set-repeats">
              {{ set.repeats }}
            </div>
            <TheCheckbox v-model="set.completed" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div v-else>
    Тренировка не найдена
  </div>
</template>
