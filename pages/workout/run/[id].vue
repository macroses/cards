<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { TrainingSession } from '~/ts'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import dayjs from 'dayjs'

const { t } = useI18n()

const { workout, originalWorkout, isLoading, error } = useRunWorkout()
const { updateSetField } = useUpdateCachedWorkout()
const { updateSetTime } = useUpdateSetTime()
const { finishWorkout, isLoading: isFinishing, resetNoTimeWorkout } = useFinishWorkout()
const { getExerciseSets } = useExerciseSets()
const { addSet, deleteSet } = useManageSets()

// 👀 UI components and states
const noTimeModal = useTemplateRef<typeof TheModal>('noTimeModal')
const valueChanged = shallowRef<string | null>(null)

// 🏋 Main workout states
const activeExerciseId = shallowRef<string | null>(null)
const exerciseSets = computed(() => getExerciseSets(workout.value))

// Initialize active exercise
watch(() => workout.value, (newWorkout) => {
  if (newWorkout && !activeExerciseId.value) {
    const firstExerciseId = Object.keys(exerciseSets.value)[0]
    activeExerciseId.value = firstExerciseId
  }
}, { immediate: true })

function toggleExercise(exerciseId: string) {
  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
}

// Editing sets functions
async function updateSetFieldValue(setId: string, field: UnionSetFields, value: number | string) {
  if (!workout.value || !value) {
    return false
  }

  valueChanged.value = `${setId}-${field}`

  return await updateSetField(
    workout.value,
    setId,
    field,
    value,
  )
}

// Editing set time
async function handleSetTimeUpdate(setId: string) {
  if (!workout.value) {
    return
  }

  await updateSetTime(workout.value, setId)
}

// Manage sets
async function handleDeleteSet(setId: string) {
  if (!workout.value) {
    return
  }

  await deleteSet(workout.value, setId)
}

async function handleAddSet(exerciseId: string) {
  if (!workout.value) {
    return
  }

  await addSet(workout.value, exerciseId)
}

// Check if all sets in an exercise have time marked
function allSetTimesMarked(sets: TrainingSession[]): boolean {
  if (!sets.length) {
    return false
  }

  return Boolean(sets.every(({ setTimeAddedAt }) => setTimeAddedAt))
}

// Finish workout
function checkSetsHaveTime(): boolean {
  return Boolean(workout.value?.sets.some(set => (set.setTime ?? 0) > 0)) ?? false
}

async function handleSaveWorkout() {
  if (!checkSetsHaveTime()) {
    noTimeModal.value?.openModal()
    return
  }

  await finishWorkout(workout.value?.id ?? '')
}

async function handleResetNoTimeWorkout() {
  noTimeModal.value?.closeModal()
  await resetNoTimeWorkout(workout.value?.id)
}

useHead({
  title: computed(() => workout.value?.title || t('pages.workout')),
})
</script>

<template>
  <div class="run-template">
    <TheLoader v-if="isLoading" />
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div
      v-else-if="workout && !isLoading"
      class="run-template__wrap"
    >
      <form
        class="workout-content"
        @submit.prevent
      >
        <RunningWorkoutHeader
          :title="workout.title"
          :workout-date="dayjs(workout.workoutDate).format('DD.MM.YYYY')"
        />

        <div class="workout-content__exercises">
          <ul
            v-for="(exercise, exerciseId) in exerciseSets"
            :key="exerciseId"
            class="workout-content__card"
          >
            <li
              v-auto-animate="{ duration: 100 }"
              class="workout-content__item"
            >
              <div
                class="workout-content__item-title"
                :class="{
                  'active': activeExerciseId === exerciseId,
                  'all-times-marked': allSetTimesMarked(exercise.sets),
                }"
                @click.prevent="toggleExercise(exerciseId)"
              >
                <TheIcon
                  icon-name="angle-down"
                  width="14"
                />
                {{ exercise.name }}
                <TheButton
                  v-if="activeExerciseId === exerciseId"
                  v-tooltip="$t('exercises.add_set')"
                  variant="transparent"
                  type="button"
                  icon-only
                  @click.stop="handleAddSet(exerciseId)"
                >
                  <TheIcon
                    icon-name="plus"
                    width="18"
                  />
                </TheButton>
              </div>

              <RunningWorkoutSetsTable
                :exercise="exercise"
                :exercise-id="exerciseId"
                :active-exercise-id="activeExerciseId"
                @update-field="updateSetFieldValue"
                @update-set-time="handleSetTimeUpdate"
                @delete-set="handleDeleteSet"
              />
            </li>
          </ul>

          <TheButton
            :loading="isFinishing"
            @click="handleSaveWorkout"
          >
            {{ $t('actions.save') }}
          </TheButton>
        </div>
      </form>
      <div class="run-template__charts">
        <WorkoutDifferenceChart
          v-if="workout && originalWorkout"
          :workout="workout"
          :original-workout="originalWorkout"
          :active-exercise-id="activeExerciseId"
        />
      </div>
    </div>

    <div
      v-else
      class="no-data"
    >
      {{ $t('pages.workout_not_found') }}
    </div>

    <LazyNoTimeMarkedReset
      ref="noTimeModal"
      @reset-no-time-workout="handleResetNoTimeWorkout"
    />
  </div>
</template>
