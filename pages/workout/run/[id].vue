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
const activeExerciseId = ref<string | null>(null)

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

watch(() => workout.value, (newWorkout) => {
  if (newWorkout && !activeExerciseId.value) {
    const firstExerciseId = Object.keys(exerciseSets.value)[0]
    activeExerciseId.value = firstExerciseId
  }
}, { immediate: true })

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

function toggleExercise(exerciseId: string) {
  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
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
            <li class="workout-content__item">
              <button
                class="workout-content__item-title"
                :class="{ active: activeExerciseId === exerciseId }"
                @click.prevent="toggleExercise(exerciseId)"
              >
                <TheIcon
                  icon-name="angle-down"
                  width="14px"
                />
                {{ exercise.name }}
              </button>

              <div
                class="sets-table"
                :class="{ active: activeExerciseId === exerciseId }"
              >
                <div class="sets-table__content">
                  <div
                    v-for="set in exercise.sets"
                    :key="set.id"
                    class="set-row"
                  >
                    <div class="set-cell">
                      <TheDropdown
                        v-model="set.difficulty"
                        @update:model-value="handleDifficultyChange(set.id, $event)"
                      >
                        <template #default="{ selectValue }">
                          <li
                            v-for="difficulty in WORKOUT_DIFFICULTY"
                            :key="difficulty.value"
                            class="dropdown__list-item"
                            :class="`difficulty-${difficulty.value}`"
                            @click="selectValue(difficulty.value)"
                          >
                            {{ difficulty.label }}
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
                        check
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
      <div class="run-template__charts" />
    </div>

    <div
      v-else
      class="no-data"
    >
      Тренировка не найдена
    </div>
  </div>
</template>
