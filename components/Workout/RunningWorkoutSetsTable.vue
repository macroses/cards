<script setup lang="ts">
import type { TrainingSession } from '~/ts'
import type { UnionSetFields } from '~/ts/types/setFields.types'
import dayjs from 'dayjs'
import { vMaska } from 'maska/vue'
import { WORKOUT_DIFFICULTY } from '~/constants'

defineProps<{
  exercise: {
    sets: TrainingSession[]
    name: string
  }
  exerciseId: string
  activeExerciseId: string | null
}>()

const emit = defineEmits<{
  deleteSet: [setId: string]
  updateField: [
    setId: string,
    field: UnionSetFields,
    value: number | string,
  ]
  updateSetTime: [setId: string]
}>()

const editingSetId = shallowRef<string | null>(null)
const editingValue = shallowRef<number | string>(0)
const editingField = shallowRef<UnionSetFields | null>(null)

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

  if (editingField.value === 'setTime') {
    editingValue.value = formattedTime(editingValue.value as string)
  }

  emit(
    'updateField',
    editingSetId.value,
    editingField.value,
    editingValue.value,
  )

  editingSetId.value = null
  editingField.value = null
}

function handleKeyDown(event: KeyboardEvent) {
  onlyNumbers(event)

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

  emit('updateField', setId, 'difficulty', value)
}
</script>

<template>
  <div
    v-if="activeExerciseId === exerciseId"
    class="sets-table"
    :class="{ active: activeExerciseId === exerciseId }"
  >
    <div
      v-auto-animate="{ duration: 300 }"
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
            :max="3"
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
            :max="3"
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
            @click="emit('updateSetTime', set.id)"
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
            @click="emit('deleteSet', set.id)"
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
</template>
