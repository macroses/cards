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
  <div v-if="runWorkout">
    <button @click="handleEndWorkout">
      finish
    </button>
    <h1>{{ runWorkout.title }}</h1>
    <ul>
      <li
        v-for="exercise in runWorkout.exercises"
        :key="exercise.exerciseId"
        class="exercise-item"
      >
        <div class="exercise-name">
          {{ exercise.exerciseName }}
        </div>
        <!-- Добавляем список сетов для каждого упражнения -->
        <ul v-if="exerciseSets[exercise.exerciseId]?.length" class="sets-list">
          <li
            v-for="set in exerciseSets[exercise.exerciseId]"
            :key="set.id"
            class="set-item"
          >
            <div
              class="workout-form__sets--difficulty"
              :data-difficulty="set.difficulty"
            />
            <div class="workout-form__sets--weight">
              {{ set.weight }}
            </div>
            <div class="workout-form__sets--repeats">
              {{ set.repeats }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div v-else>
    Тренировка не найдена
  </div>
</template>
