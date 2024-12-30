<script setup lang="ts">
import TheInput from '@/components/ui/TheInput/TheInput.vue'

const { endWorkout } = useFinishWorkout()
const { getData } = useRunWorkoutChart()
const { updateSets } = useUpdateSet()

const {
  runWorkout,
  initRunMode,
  originalWorkout,
} = useRunWorkout()

const {
  activeExercises,
  toggleExercise,
  initActiveExercise,
} = useActiveExercises()

const {
  editingState,
  handleEdit,
  handleInputSubmit,
  setInputRef,
  handleInputChange,
} = useEditingSetState()

const {
  setTimes,
  formatSetTime,
  handleSetTime,
  initSetTimes,
} = useSetTimeManagement()

const option = shallowRef(getData(originalWorkout.value, runWorkout.value, activeExercises.value))

async function handleFinishWorkout() {
  if (runWorkout.value) {
    const success = await updateSets(runWorkout.value.sets)

    if (success) {
      const workoutEnded = await endWorkout(runWorkout.value.id)

      if (workoutEnded) {
        navigateTo('/')
      }
    }
  }
}

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

const isExerciseCompleted = computed(() => {
  return (exerciseId: number) => {
    const exerciseSetsArray = exerciseSets.value[exerciseId] || []
    if (!exerciseSetsArray.length)
      return false

    return exerciseSetsArray.every(set => setTimes.value[set.id])
  }
})

watchEffect(() => {
  option.value = getData(originalWorkout.value, runWorkout.value, activeExercises.value)
})

watch([runWorkout], ([workout]: [typeof runWorkout.value]) => {
  if (workout && workout.sets) {
    initSetTimes(workout.sets)
  }
}, { immediate: true })

watch(setTimes, () => {
  activeExercises.value.forEach((exerciseId) => {
    if (isExerciseCompleted.value(exerciseId)) {
      activeExercises.value.delete(exerciseId)
    }
  })
}, { deep: true })

onMounted(async () => {
  await initRunMode()

  if (runWorkout.value) {
    initActiveExercise(runWorkout.value.exercises)
  }
})
</script>

<template>
  <div class="run-template">
    <h1
      v-if="runWorkout"
      class="run__title"
    >
      {{ runWorkout.title }}
    </h1>
    <div
      v-if="runWorkout"
      class="run"
    >
      <div class="run__current">
        <ul class="run__exercises-list">
          <li
            v-for="exercise in runWorkout.exercises"
            :key="exercise.exerciseId"
            class="run__exercise-item"
          >
            <div
              class="run__exercise"
              :class="{
                active: activeExercises.has(exercise.exerciseId),
                done: isExerciseCompleted(exercise.exerciseId),
              }"
              @click="toggleExercise(exercise.exerciseId)"
            >
              <TheIcon
                icon-name="angle-down"
                width="14px"
              />
              <span>{{ exercise.exerciseName }}</span>
            </div>
            <div
              class="run__sets-container"
              :class="{ active: activeExercises.has(exercise.exerciseId) }"
            >
              <ul
                v-if="exerciseSets[exercise.exerciseId]?.length"
                class="run__sets"
              >
                <li class="run__sets-header">
                  <div>
                    <TheIcon
                      icon-name="chart-simple"
                      width="14px"
                    />
                    Level
                  </div>
                  <div>
                    <TheIcon
                      icon-name="weight-hanging"
                      width="14px"
                    />
                    Weight
                  </div>
                  <div>
                    <TheIcon
                      icon-name="repeat"
                      width="14px"
                    />
                    Repeat
                  </div>
                  <div>
                    <TheIcon
                      icon-name="clock"
                      width="14px"
                    />
                    Time
                  </div>
                </li>
                <li
                  v-for="set in exerciseSets[exercise.exerciseId]"
                  :key="set.id"
                  class="run__set-item"
                >
                  <div class="run__set-difficulty">
                    <TheDropdown v-model="set.difficulty" />
                  </div>
                  <div
                    class="run__set-weight"
                    @click="handleEdit(set.id, 'weight')"
                  >
                    <TheInput
                      v-if="editingState.setId === set.id && editingState.field === 'weight'"
                      :ref="setInputRef(set.id)"
                      v-model="set.weight"
                      placeholder="Вес"
                      type="number"
                      inputmode="numeric"
                      @keyup.enter="handleInputSubmit"
                      @blur="handleInputSubmit"
                      @input="handleInputChange($event, set, 'weight')"
                    />
                    <div
                      v-else
                      class="run__set-weight--value"
                    >
                      {{ set.weight || 0 }}
                    </div>
                  </div>
                  <div
                    class="run__set-repeats"
                    @click="handleEdit(set.id, 'repeats')"
                  >
                    <TheInput
                      v-if="editingState.setId === set.id && editingState.field === 'repeats'"
                      :ref="setInputRef(set.id)"
                      v-model="set.repeats"
                      placeholder="Повторения"
                      type="number"
                      inputmode="numeric"
                      @keyup.enter="handleInputSubmit"
                      @blur="handleInputSubmit"
                      @input="handleInputChange($event, set, 'repeats')"
                    />
                    <div
                      v-else
                      class="run__set-repeats--value"
                    >
                      {{ set.repeats || 0 }}
                    </div>
                  </div>
                  <div class="run__set-time">
                    {{ setTimes[set.id] ? formatSetTime(setTimes[set.id]) : '' }}
                    <TheButton
                      v-if="!setTimes[set.id]"
                      variant="secondary"
                      icon-only
                      @click="handleSetTime(set.id)"
                    >
                      <TheIcon
                        icon-name="clock"
                        width="18px"
                      />
                    </TheButton>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <button @click="handleFinishWorkout">
          finish
        </button>
      </div>

      <div class="run__initial">
        <VChart :option="option" />
      </div>
    </div>
    <div v-else>
      Тренировка не найдена
    </div>
  </div>
</template>
