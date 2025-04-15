<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import dayjs from 'dayjs'
import { vMaska } from 'maska/vue'
import NoTimeMarkedReset from '~/components/NoTimeMarkedReset/NoTimeMarkedReset.vue'
import { WORKOUT_DIFFICULTY } from '~/constants/workout'

const { workout, isLoading, error } = useRunWorkout()
const { updateSetField } = useUpdateCachedWorkout()
const { updateSetTime } = useUpdateSetTime()
const { timer } = useWorkoutTimer()
const { finishWorkout, isLoading: isFinishing, resetNoTimeWorkout } = useFinishWorkout()
const { getExerciseSets } = useExerciseSets()
const { addSet, deleteSet } = useManageSets()

const editingSetId = ref<string | null>(null)
const editingValue = ref<number | string>(0)
const editingField = ref<UnionSetFields | null>(null)
const activeExerciseId = ref<string | null>(null)

const isDescriptionVisible = shallowRef(true)

const noTimeModal = useTemplateRef<typeof TheModal>('noTimeModal')

async function updateSetFieldValue(setId: string, field: UnionSetFields, value: number | string) {
  if (!workout.value || !value) {
    return false
  }

  return await updateSetField(
    workout.value,
    setId,
    field,
    value,
  )
}

const exerciseSets = computed(() => getExerciseSets(workout.value))

watch(() => workout.value, (newWorkout) => {
  if (newWorkout && !activeExerciseId.value) {
    const firstExerciseId = Object.keys(exerciseSets.value)[0]
    activeExerciseId.value = firstExerciseId
  }
}, { immediate: true })

function startEditing(set: any, field: UnionSetFields) {
  editingSetId.value = set.id
  editingField.value = field

  if (field !== 'setTime') {
    editingValue.value = set[field]

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
  if (event.key === 'Enter') {
    saveEdit()
  }
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

async function handleSetTimeUpdate(setId: string) {
  if (!workout.value) {
    return
  }

  await updateSetTime(workout.value, setId)
}

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

async function handleSaveWorkout() {
  if (!workout.value) {
    return
  }

  if (!checkSetsHaveTime()) {
    noTimeModal.value?.openModal()

    return
  }

  await finishWorkout(workout.value.id)
}

function toggleExercise(exerciseId: string) {
  if (editingSetId.value || editingField.value) {
    return
  }

  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
}

async function handleResetNoTimeWorkout() {
  noTimeModal.value?.closeModal()
  await resetNoTimeWorkout(workout.value?.id)
}

function checkSetsHaveTime(): boolean {
  if (!workout.value) {
    return false
  }

  return workout.value.sets.some(set => (set.setTime ?? 0) > 0)
}

useHead({
  title: computed(() => workout.value?.title || 'Тренировка'),
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
      <form class="workout-content">
        <div
          class="workout-description"
          :class="{ hidden: !isDescriptionVisible }"
        >
          <h2 class="workout-header">
            {{ workout.title }}
          </h2>
          <div>{{ dayjs(workout.workoutDate).format('DD.MM.YYYY') }}</div>

          <TheButton
            variant="success"
            inert
            class="workout-description__odometer"
          >
            <OdometerTimer :time="timer" />
          </TheButton>
        </div>

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
                :class="{ active: activeExerciseId === exerciseId }"
                @click.prevent="toggleExercise(exerciseId)"
              >
                <TheIcon
                  icon-name="angle-down"
                  width="14px"
                />
                {{ exercise.name }}
                <TheButton
                  v-tooltip="'Добавить подход'"
                  variant="transparent"
                  type="button"
                  icon-only
                  @click.stop="handleAddSet(exerciseId)"
                >
                  <TheIcon
                    icon-name="plus"
                    width="18px"
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
                  <ul>
                    <li class="set-header">
                      <div class="set-header__cell">
                        <TheIcon
                          icon-name="chart-simple"
                          width="12px"
                        />
                        Level
                      </div>
                      <div class="set-header__cell">
                        <TheIcon
                          icon-name="weight-hanging"
                          width="12px"
                        />
                        Weight
                      </div>
                      <div class="set-header__cell">
                        <TheIcon
                          icon-name="repeat"
                          width="12px"
                        />
                        Repeats
                      </div>
                      <div class="set-header__cell">
                        <TheIcon
                          icon-name="clock"
                          width="12px"
                        />
                        Time
                      </div>
                      <div class="set-header__cell" />
                    </li>
                  </ul>
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
                        v-model.number="editingValue"
                        v-focus
                        type="number"
                        placeholder="Вес"
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
                        v-model.number="editingValue"
                        v-focus
                        type="number"
                        placeholder="Повторения"
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
                        no-clear
                        type="text"
                        placeholder="00m:00s"
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
                        icon-only
                        class="mark-set-time"
                        @click="handleSetTimeUpdate(set.id)"
                      >
                        <TheIcon
                          icon-name="clock"
                          width="18px"
                        />
                      </TheButton>
                    </div>
                    <div class="set-cell">
                      <TheButton
                        variant="transparent"
                        icon-only
                        :class="{ disabled: exercise.sets.length === 1 }"
                        @click="handleDeleteSet(set.id)"
                      >
                        <TheIcon
                          icon-name="trash-can"
                          width="18px"
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
            Сохранить
          </TheButton>
        </div>
      </form>
      <div class="run-template__charts">
        <WorkoutTimePredictor :workout />
      </div>
    </div>

    <div
      v-else
      class="no-data"
    >
      Тренировка не найдена
    </div>

    <NoTimeMarkedReset
      ref="noTimeModal"
      @reset-no-time-workout="handleResetNoTimeWorkout"
    />
  </div>
</template>

<style scoped>
.add-set-button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-set-button:hover {
  background-color: #e0e0e0;
}
</style>
