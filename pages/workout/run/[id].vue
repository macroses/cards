<script setup lang="ts">
import type { CreateWorkoutResponse } from '~/ts/interfaces/createWorkout.interface'
import TheInput from '@/components/ui/TheInput/TheInput.vue'
import { watchImmediate } from '@vueuse/core'
import TheModal from '~/components/ui/TheModal/TheModal.vue'
import { MAX_LENGTH_NUMBER } from '~/constants'

const { endWorkout, resetNoTimeWorkout } = useFinishWorkout()
const { getData } = useRunWorkoutChart()
const { updateSets, addNewSet } = useUpdateSet()

const {
  runWorkout,
  initRunMode,
  originalWorkout,
  isLoading,
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

const option = shallowRef(getData(
  originalWorkout.value,
  runWorkout.value,
  activeExercises.value,
))

const noTimeModal = useTemplateRef<typeof TheModal>('noTimeModal')

function checkSetsHaveTime(): boolean {
  if (!runWorkout.value) {
    return false
  }

  return runWorkout.value.sets.some((set: CreateWorkoutResponse['sets'][0]) => setTimes.value[set.id])
}

async function handleFinishWorkout() {
  if (runWorkout.value) {
    if (!checkSetsHaveTime()) {
      noTimeModal.value?.openModal()

      return
    }

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

  return runWorkout.value.sets.reduce((
    acc: Record<string, CreateWorkoutResponse['sets']>,
    set: CreateWorkoutResponse['sets'][0],
  ) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = []
    }

    acc[set.exerciseId].push(set)

    return acc
  }, {})
})

const isExerciseCompleted = computed(() => {
  return function (exerciseId: string): boolean {
    const exerciseSetsArray = exerciseSets.value[exerciseId] || []

    if (!exerciseSetsArray.length) {
      return false
    }

    return exerciseSetsArray.every((set: CreateWorkoutResponse['sets'][0]) => setTimes.value[set.id])
  }
})

async function handleResetNoTimeWorkout() {
  noTimeModal.value?.closeModal()
  await resetNoTimeWorkout(runWorkout.value?.id)
}

watchEffect(() => {
  option.value = getData(originalWorkout.value, runWorkout.value, activeExercises.value)
})

watchImmediate([runWorkout], ([workout]: [typeof runWorkout.value]) => {
  if (workout && workout.sets) {
    initSetTimes(workout.sets)
  }
})

onMounted(async () => {
  await initRunMode()

  if (runWorkout.value) {
    initActiveExercise(runWorkout.value.exercises)
  }
})
</script>

<template>
  <div class="run-template">
    <div v-if="isLoading">
      <TheLoader />
    </div>
    <template v-else-if="runWorkout">
      <h1 class="run__title">
        {{ runWorkout.title }}
      </h1>
      <div class="run">
        <div class="run__current">
          <ul class="run__exercises-list">
            <li
              v-for="exercise in runWorkout.exercises"
              :key="exercise.exerciseId"
              class="run__exercise-item"
            >
              <div
                class="run__exercise"
                :class="{ done: isExerciseCompleted(exercise.exerciseId) }"
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
                <TheButton
                  v-if="!exerciseSets[exercise.exerciseId]?.length"
                  class="run__add-set"
                  @click="addNewSet(exercise.exerciseId, runWorkout)"
                >
                  Добавить сет
                </TheButton>
                <ul
                  v-else
                  v-auto-animate="{ duration: 100 }"
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
                        :max="MAX_LENGTH_NUMBER"
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
                        :max="MAX_LENGTH_NUMBER"
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
                        :disabled="!set.repeats || !set.weight"
                        @click="handleSetTime(set.id)"
                      >
                        <TheIcon
                          icon-name="clock"
                          width="18px"
                        />
                      </TheButton>
                    </div>
                  </li>
                  <li class="run__set-item run__set-item--add">
                    <TheButton
                      class="run__add-set"
                      @click="addNewSet(exercise.exerciseId, runWorkout)"
                    >
                      Добавить сет
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
      <TheModal ref="noTimeModal">
        <template #title>
          <h3>{{ $t('workout.no_time_warning') }}</h3>
        </template>
        <template #content>
          <p>{{ $t('workout.no_time_description') }}</p>
        </template>
        <template #footer>
          <TheButton @click="handleResetNoTimeWorkout">
            {{ $t('common.ok') }}
          </TheButton>
        </template>
      </TheModal>
    </template>
  </div>
</template>
