<script setup lang="ts">
import TheInput from '@/components/ui/TheInput/TheInput.vue'

interface EditingState {
  setId: string | null
  field: 'weight' | 'repeats' | null
}

const { runWorkout, initRunMode, originalWorkout, isLoading } = useRunWorkout()
const { endWorkout } = useFinishWorkout()
const { getData } = useRunWorkoutChart()
const { activeWorkout } = useWorkoutTimer()
const { updateSetTime } = useSetTime()

const activeExercises = ref<Set<number>>(new Set())
const option = shallowRef(getData(originalWorkout.value, runWorkout.value, activeExercises.value))
const setTimes = ref<Record<string, number>>({})
const lastSetTime = ref<number | null>(null)

async function handleFinishWorkout() {
  if (runWorkout.value) {
    const success = await endWorkout(runWorkout.value.id)

    if (success) {
      navigateTo('/')
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

const editingState = ref<EditingState>({
  setId: null,
  field: null,
})

const inputRefs = ref<Record<string, InstanceType<typeof TheInput>>>({})

function handleEdit(setId: string, field: 'weight' | 'repeats') {
  editingState.value = { setId, field }

  nextTick(() => {
    if (inputRefs.value[setId]) {
      inputRefs.value[setId]?.focus()
    }
  })
}

function handleInputSubmit() {
  editingState.value = { setId: null, field: null }
}

function setInputRef(setId: string): (el: any) => void {
  return (el) => {
    if (el) {
      inputRefs.value[setId] = el
    }
  }
}

function toggleExercise(exerciseId: number) {
  if (activeExercises.value.has(exerciseId)) {
    activeExercises.value.delete(exerciseId)
  }
  else {
    activeExercises.value.add(exerciseId)
  }
}

function handleInputChange(event: Event, set: any, field: 'weight' | 'repeats') {
  if (!(event.target as HTMLInputElement).value) {
    set[field] = 0
  }
}

function formatTime(timestamp: number): string {
  if (!activeWorkout.value?.startedAt)
    return '--:--'

  const sortedSetTimes = Object.entries(setTimes.value)
    .sort(([, a], [, b]) => a - b)
    .map(([id, time]) => ({ id, time }))

  const currentSetIndex = sortedSetTimes.findIndex(set => set.time === timestamp)
  const previousSet = currentSetIndex > 0 ? sortedSetTimes[currentSetIndex - 1] : null

  const startTime = previousSet
    ? previousSet.time
    : new Date(activeWorkout.value.startedAt).getTime()

  const timeDiff = timestamp - startTime
  const minutes = Math.floor(timeDiff / 60000)
  const seconds = Math.floor((timeDiff % 60000) / 1000)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

async function handleSetTime(setId: string) {
  const currentTime = Date.now()

  if (!lastSetTime.value && activeWorkout.value?.startedAt) {
    setTimes.value[setId] = currentTime
    await updateSetTime(setId, currentTime)
  }
  else if (lastSetTime.value) {
    setTimes.value[setId] = currentTime
    await updateSetTime(setId, currentTime)
  }

  lastSetTime.value = currentTime
}

watchEffect(() => {
  option.value = getData(originalWorkout.value, runWorkout.value, activeExercises.value)
})

async function initSetTimes() {
  if (!runWorkout.value?.sets)
    return

  runWorkout.value.sets.forEach((set) => {
    if (set.setTime) {
      setTimes.value[set.id] = Number(set.setTime)
    }
  })
}

watch([runWorkout, isLoading], ([workout, loading]) => {
  if (workout && !loading) {
    initSetTimes()
  }
}, { immediate: true })

onMounted(async () => {
  await initRunMode()

  if (runWorkout.value && runWorkout.value.exercises.length > 0) {
    activeExercises.value.add(runWorkout.value.exercises[0].exerciseId)
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
              :class="{ active: activeExercises.has(exercise.exerciseId) }"
              @click="toggleExercise(exercise.exerciseId)"
            >
              <TheIcon
                icon-name="angle-down"
                width="14px"
              />
              {{ exercise.exerciseName }}
            </div>
            <div
              class="run__sets-container"
              :class="{ active: activeExercises.has(exercise.exerciseId) }"
            >
              <ul
                v-if="exerciseSets[exercise.exerciseId]?.length"
                class="run__sets"
              >
                <li
                  v-for="set in exerciseSets[exercise.exerciseId]"
                  :key="set.id"
                  class="run__set-item"
                >
                  <div class="run__set-difficulty">
                    {{ set.difficulty }}
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
                      {{ set.weight }}
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
                      {{ set.repeats }}
                    </div>
                  </div>
                  <div class="time">
                    {{ setTimes[set.id] ? formatTime(setTimes[set.id]) : '--:--' }}
                  </div>
                  <TheButton
                    v-if="!setTimes[set.id]"
                    variant="ghost"
                    icon-only
                    class="run__set-time"
                    @click="handleSetTime(set.id)"
                  >
                    <TheIcon
                      icon-name="circle-check"
                      width="18px"
                    />
                  </TheButton>
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
