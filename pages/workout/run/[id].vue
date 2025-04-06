<script setup lang="ts">
import type { CreateWorkoutResponse } from '~/ts/interfaces'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import dayjs from 'dayjs'
import { WORKOUT_DIFFICULTY } from '~/constants/workout'

definePageMeta({
  middleware: ['auth'],
})

const { workout, isLoading, error } = useRunWorkout()
const { updateSetField } = useUpdateCachedWorkout()
const { updateSetTime } = useUpdateSetTime()
const { timer } = useWorkoutTimer()
const { finishWorkout, isLoading: isFinishing } = useFinishWorkout()

const editingSetId = ref<string | null>(null)
const editingValue = ref<number | string>(0)
const editingField = ref<UnionSetFields | null>(null)

const isDescriptionVisible = shallowRef(true)

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

const exerciseSets = computed(() => {
  if (!workout.value) {
    return {}
  }

  return workout.value.sets.reduce((acc, set) => {
    const exerciseId = set.exerciseId

    if (!acc[exerciseId]) {
      acc[exerciseId] = {
        sets: [],
        name: workout.value?.exercises.find(e => e.exerciseId === exerciseId)?.exerciseName || 'Unknown',
      }
    }
    acc[exerciseId].sets.push(set)

    return acc
  }, {} as Record<string, { sets: CreateWorkoutResponse['sets'], name: string }>)
})

function parseTimeString(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number)
  return minutes * 60 + seconds
}

function formatTimeString(seconds: number): string {
  const duration = dayjs.duration(seconds, 'seconds')
  return duration.format('mm:ss')
}

function startEditing(set: any, field: UnionSetFields) {
  editingSetId.value = set.id
  editingField.value = field

  if (field === 'setTime') {
    editingValue.value = formatTimeString(set[field] || 0)
  }
  else {
    editingValue.value = set[field]
  }
}

async function saveEdit() {
  if (!editingSetId.value || !editingField.value)
    return

  let valueToSave = editingValue.value
  if (editingField.value === 'setTime') {
    valueToSave = parseTimeString(editingValue.value as string)
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

async function handleSaveWorkout() {
  if (!workout.value) {
    return
  }

  await finishWorkout(workout.value.id)
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

    <form
      v-else-if="workout && !isLoading"
      class="workout-content"
    >
      <div
        class="workout-description"
        :class="{ hidden: !isDescriptionVisible }"
      >
        <h2 class="workout-header">
          {{ workout.title }}
        </h2>
        <div>{{ dayjs(workout.workoutDate).format('DD.MM.YYYY') }}</div>
        <TheButton
          variant="secondary"
          icon-only
          class="close-description"
          @click="isDescriptionVisible = false"
        >
          <TheIcon
            icon-name="xmark"
            width="20px"
          />
        </TheButton>
      </div>

      <OdometerTimer :time="timer" />
      <ul
        v-for="(exercise, exerciseId) in exerciseSets"
        :key="exerciseId"
        class="exercise-card"
      >
        <li class="exercise-card__item">
          <h3>{{ exercise.name }}</h3>

          <div class="sets-table">
            <div
              v-for="set in exercise.sets"
              :key="set.id"
              class="set-row"
            >
              <div class="set-cell">
                <TheSelectCustom
                  :model-value="set.difficulty"
                  class="edit-input"
                  @update:model-value="handleDifficultyChange(set.id, $event)"
                >
                  <template #options>
                    <option
                      v-for="difficulty in WORKOUT_DIFFICULTY"
                      :key="difficulty.value"
                      :value="difficulty.value"
                    >
                      {{ difficulty.label }}
                    </option>
                  </template>
                </TheSelectCustom>
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
                  @keydown="handleKeyDown"
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
                  @keydown="handleKeyDown"
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
                  type="text"
                  placeholder="00:00"
                  pattern="[0-9]{2}:[0-9]{2}"
                  inputmode="numeric"
                  class="edit-input"
                  @blur="saveEdit"
                  @keydown="handleKeyDown"
                />
                <div
                  v-else
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
                  check
                </TheButton>
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

      <!--      <div class="run__initial"> -->
      <!--        <VChart :option="option" /> -->
      <!--      </div> -->
    </form>

    <div
      v-else
      class="no-data"
    >
      Тренировка не найдена
    </div>
  </div>
</template>

<style scoped>
.workout-content {
  padding: 16px;
}

.workout-description {
  position: fixed;
  top: 4px;
  left: calc(50% - 150px);
  background-color: var(--color-white);
  border: 1px solid oklch(from var(--color-accent) l c h / 0.2);
  box-shadow: oklch(from var(--color-accent) l c h / 0.1) -4px 9px 25px -6px;
  border-radius: 20px;
  padding: 12px 55px 12px 12px;
  z-index: 10;
  transition: transform var(--base-transition);
  max-width: 320px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  &.hidden {
    transform: translateY(-120%);
  }
}

.workout-header {
  font-size: 16px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exercise-card {
  background: var(--color-white);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.sets-table {
  width: 100%;
  margin-top: 12px;
}

.table-header, .set-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px 0;
}

.table-header {
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.set-cell {
  display: flex;
  align-items: center;
}

.edit-input {
  width: 80px;
}

.editable-value {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.editable-value:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.close-description {
  position: absolute;
  right: 12px;
  top: 12px;
}
</style>
