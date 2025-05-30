<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { TrainingSession } from '~/ts'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import dayjs from 'dayjs'
import { vMaska } from 'maska/vue'
import { WORKOUT_DIFFICULTY } from '~/constants'

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

// Editing set states
const editingSetId = shallowRef<string | null>(null)
const editingValue = shallowRef<number | string>(0)
const editingField = shallowRef<UnionSetFields | null>(null)

function toggleExercise(exerciseId: string) {
  if (editingSetId.value || editingField.value) {
    return
  }

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

function startEditing(set: TrainingSession, field: UnionSetFields) {
  editingSetId.value = set.id
  editingField.value = field

  if (field !== 'setTime') {
    editingValue.value = set[field] ?? 0
    return
  }

  editingValue.value = dayjs.duration(set[field] || 0, 'seconds').format('mm:ss')
}

async function saveEdit() {
  if (!editingSetId.value || !editingField.value) {
    return
  }

  let valueToSave = editingValue.value

  if (editingField.value === 'setTime') {
    valueToSave = formattedTime(editingValue.value as string)
  }

  await updateSetFieldValue(
    editingSetId.value,
    editingField.value,
    valueToSave,
  )

  editingSetId.value = null
  editingField.value = null
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Enter') {
    return
  }

  saveEdit()
}

function isInputVisible(setId: string, field: UnionSetFields) {
  return editingSetId.value === setId && editingField.value === field
}

function handleDifficultyChange(setId: string, value: number | undefined) {
  if (!value) {
    return
  }

  updateSetFieldValue(setId, 'difficulty', value)
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
  await addSet(workout.value!, exerciseId)
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

              <div
                v-if="activeExerciseId === exerciseId"
                class="sets-table"
                :class="{ active: activeExerciseId === exerciseId }"
              >
                <div
                  v-auto-animate="{ duration: 100 }"
                  class="sets-table__content"
                >
                  <RunningWorkoutTableHead />
                  <div
                    v-for="set in exercise.sets"
                    :key="set.id"
                    class="set-row"
                  >
                    <div class="set-cell">
                      <TheDropdown
                        v-model="set.difficulty"
                        no-icon
                        @update:model-value="handleDifficultyChange(set.id, $event)"
                      >
                        <template #default="{ selectValue }">
                          <li
                            v-for="difficulty in WORKOUT_DIFFICULTY"
                            :key="difficulty.value"
                            class="difficulty__list-item"
                            @click="selectValue(difficulty.value)"
                          >
                            <span :class="`difficulty-${difficulty.value}`" />
                            {{ difficulty.value }}
                          </li>
                        </template>
                      </TheDropdown>
                    </div>
                    <div class="set-cell">
                      <TheInput
                        v-if="isInputVisible(set.id, 'weight')"
                        v-model="editingValue"
                        v-focus
                        type="number"
                        :placeholder="$t('inputs.weight')"
                        inputmode="decimal"
                        class="edit-input"
                        @blur="saveEdit"
                        @keydown.stop="handleKeyDown"
                      />
                      <div
                        v-else
                        class="editable-value"
                        @click="startEditing(set, 'weight')"
                      >
                        {{ set.weight }}
                      </div>
                    </div>

                    <div class="set-cell">
                      <TheInput
                        v-if="isInputVisible(set.id, 'repeats')"
                        v-model="editingValue"
                        v-focus
                        type="number"
                        :placeholder="$t('inputs.repeats')"
                        inputmode="numeric"
                        class="edit-input"
                        @blur="saveEdit"
                        @keydown.stop="handleKeyDown"
                      />
                      <div
                        v-else
                        class="editable-value"
                        @click="startEditing(set, 'repeats')"
                      >
                        {{ set.repeats }}
                      </div>
                    </div>
                    <div class="set-cell">
                      <TheInput
                        v-if="isInputVisible(set.id, 'setTime') && set.setTimeAddedAt"
                        v-model="editingValue"
                        v-focus
                        v-maska="'##:##'"
                        type="text"
                        :placeholder="$t('inputs.time_format')"
                        inputmode="numeric"
                        class="edit-input"
                        @blur="saveEdit"
                        @keydown.stop="handleKeyDown"
                      />
                      <div
                        v-else-if="set.setTimeAddedAt"
                        class="editable-value"
                        @click="startEditing(set, 'setTime')"
                      >
                        {{ dayjs.duration(set.setTime || 0, 'seconds').format('mm:ss') }}
                      </div>
                      <TheButton
                        v-if="!set.setTimeAddedAt"
                        variant="secondary"
                        class="mark-set-time"
                        @click="handleSetTimeUpdate(set.id)"
                      >
                        <TheIcon
                          icon-name="clock"
                          width="18"
                        />
                      </TheButton>
                    </div>
                    <div class="set-cell">
                      <TheButton
                        variant="transparent"
                        icon-only
                        class="delete-set__button"
                        :class="{ disabled: exercise.sets.length === 1 }"
                        @click="handleDeleteSet(set.id)"
                      >
                        <TheIcon
                          icon-name="trash-can"
                          width="18"
                        />
                      </TheButton>
                    </div>
                  </div>
                </div>
              </div>
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
