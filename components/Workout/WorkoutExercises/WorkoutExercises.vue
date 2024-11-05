<script setup lang="ts">
import type { Exercise } from '~/types/Exercise'
import type { WorkoutSet } from '~/types/Workout'

interface Props {
  exercises: Exercise[]
  activeExerciseId: number | null
  exerciseData: Map<number, any>
  workoutExercises: {
    exerciseId: number
    sets: WorkoutSet[]
  }[]
}

defineProps<Props>()

const emit = defineEmits<{
  toggleExercise: [id: number]
  removeExercise: [id: number]
  addSet: [id: number]
  removeSet: [exerciseId: number, setId: string]
}>()

const isWorkoutSetValid = ref(false)

const workoutSetRules = [
  createValidationRule('required'),
  createValidationRule('numbersOnly'),
]
</script>

<template>
  <ul
    v-if="exercises.length"
    v-auto-animate
    class="workout__exercises"
  >
    <li
      v-for="exercise in exercises"
      :key="exercise.id"
      class="workout__exercises-item"
      :class="{ active: activeExerciseId === exercise.id }"
    >
      <div
        class="workout__exercises-item-name"
        @click.stop="emit('toggleExercise', exercise.id)"
      >
        <TheIcon
          icon-name="angle-down"
          width="14px"
          class="workout__exercises__title-icon"
        />
        {{ exercise.name }}
        <TheButton
          variant="ghost"
          icon-only
          @click="emit('removeExercise', exercise.id)"
        >
          <TheIcon
            icon-name="xmark"
            width="14px"
            :style="{ color: 'rgb(var(--text-color))' }"
          />
        </TheButton>
      </div>

      <div class="exercise-form__wr">
        <div class="exercise-form">
          <div class="exercise-form__main">
            <TheInput
              v-model.number="(exerciseData.get(exercise.id).currentWeight)"
              placeholder="Вес"
              :validate-rules="workoutSetRules"
              @keydown="onlyNumbers($event)"
              @validation="isWorkoutSetValid = $event"
            />
            <TheInput
              v-model.number="exerciseData.get(exercise.id).currentRepeats"
              placeholder="Повторения"
              :validate-rules="workoutSetRules"
              @keydown="onlyNumbers($event)"
              @validation="isWorkoutSetValid = $event"
            />
            <select
              v-model="exerciseData.get(exercise.id).currentDifficulty"
              class="difficulty-select"
            >
              <option value="1">
                1
              </option>
              <option value="2">
                2
              </option>
              <option value="3">
                3
              </option>
              <option value="4">
                4
              </option>
              <option value="5">
                5
              </option>
            </select>
          </div>
          <button @click="emit('addSet', exercise.id)">
            Добавить
          </button>

          <table
            v-if="workoutExercises.find(e => e.exerciseId === exercise.id)?.sets.length"
          >
            <tr
              v-for="set in workoutExercises.find(e => e.exerciseId === exercise.id)?.sets"
              :key="set.id"
            >
              <td>{{ set.weight }}</td>
              <td>{{ set.repeats }}</td>
              <td>{{ set.difficulty }}/5</td>
              <td>
                <TheButton
                  variant="ghost"
                  icon-only
                  @click="emit('removeSet', exercise.id, set.id)"
                >
                  <TheIcon
                    icon-name="xmark"
                    width="16px"
                  />
                </TheButton>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </li>
  </ul>
  <p
    v-else
    class="exercises-empty"
  >
    Add exercise
  </p>
</template>
