<script setup lang="ts">
import type { CreateWorkoutResponse } from '~/ts/interfaces'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import { WORKOUT_DIFFICULTY } from '~/constants/workout'

definePageMeta({
  middleware: ['auth'],
})

const { workout, isLoading, error } = useRunWorkout()
const { updateSetField } = useUpdateCachedWorkout()
const { timer } = useWorkoutTimer()

const editingSetId = ref<string | null>(null)
const editingValue = ref<number | string>(0)
const editingField = ref<UnionSetFields | null>(null)

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

function startEditing(set: any, field: UnionSetFields) {
  editingSetId.value = set.id
  editingValue.value = set[field]
  editingField.value = field
}

async function saveEdit() {
  if (!editingSetId.value || !editingField.value)
    return

  await updateSetFieldValue(
    editingSetId.value,
    editingField.value,
    editingValue.value,
  )

  editingSetId.value = null
  editingField.value = null
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    saveEdit()
  }
}

function isInputVisible(setId: string, field: 'weight' | 'repeats') {
  return editingSetId.value === setId && editingField.value === field
}

function handleDifficultyChange(setId: string, value: number | undefined) {
  if (!value) {
    return
  }

  updateSetFieldValue(setId, 'difficulty', value)
}
</script>

<template>
  <div class="run-template">
    <div v-if="isLoading" class="loading">
      Загрузка тренировки...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="workout" class="workout-content">
      <div class="workout-header">
        <h2>{{ workout.title }}</h2>
        <OdometerTimer :time="timer" />
      </div>

      <div
        v-for="(exercise, exerciseId) in exerciseSets"
        :key="exerciseId"
        class="exercise-card"
      >
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
                @update:model-value="(value) => handleDifficultyChange(set.id, value)"
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
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      Тренировка не найдена
    </div>
  </div>
</template>

<style scoped>
.workout-content {
  padding: 16px;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
</style>
