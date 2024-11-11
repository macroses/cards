<script setup lang="ts">
import type { Props } from './workoutExerciseTypes'
import { useWorkoutExercises } from '~/composables/workout/useWorkoutExercises'

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleExercise: [id: number]
  removeExercise: [id: number]
  addSet: [id: number]
  removeSet: [exerciseId: number, setId: string]
}>()

const {
  isWorkoutSetValid,
  workoutSetRules,
  workoutExercisesLength,
  calculateTonnage,
  totalTonnage,
} = useWorkoutExercises(props.workoutExercises)

function getExerciseData(exerciseId: number) {
  return props.exerciseData.get(exerciseId) || {
    currentWeight: '',
    currentRepeats: '',
    currentDifficulty: 1,
  }
}
</script>

<template>
  <div
    v-auto-animate
    class="workout-exercises-wrapper"
  >
    <div
      v-if="totalTonnage"
      class="workout-total"
    >
      Total tonnage: <span> {{ (totalTonnage / 1000).toFixed(2) }} T</span>
    </div>
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
          <span>{{ exercise.name }}</span>
          <div class="workout__exercises-chart">
            <TheButton
              variant="transparent"
              icon-only
            >
              <TheIcon
                icon-name="chart-waterfall"
                width="14px"
              />
            </TheButton>
          </div>
          <div
            v-if="calculateTonnage(exercise.id) > 0"
            class="workout__exercise-tonnage"
          >
            {{ (calculateTonnage(exercise.id) / 1000).toFixed(2) }} T
          </div>
          <TheButton
            variant="transparent"
            icon-only
            @click="emit('removeExercise', exercise.id)"
          >
            <TheIcon
              icon-name="xmark"
              width="14px"
            />
          </TheButton>
        </div>

        <div class="exercise-form__wr">
          <form
            v-auto-animate
            class="exercise-form"
            @submit.prevent="emit('addSet', exercise.id)"
          >
            <div class="exercise-form__main">
              <TheInput
                v-model.number="getExerciseData(exercise.id).currentWeight"
                placeholder="Вес"
                type="number"
                inputmode="numeric"
                no-clear
                :validate-rules="workoutSetRules"
                @validation="isWorkoutSetValid = $event"
              />
              <TheInput
                v-model.number="getExerciseData(exercise.id).currentRepeats"
                placeholder="Повторения"
                type="number"
                inputmode="numeric"
                no-clear
                :validate-rules="workoutSetRules"
                @validation="isWorkoutSetValid = $event"
              />
            </div>
            <div class="exercise-form__submit">
              <WorkoutDifficulty
                v-model="getExerciseData(exercise.id).currentDifficulty"
              />
              <TheButton
                type="submit"
                :disabled="!isWorkoutSetValid"
              >
                Append
              </TheButton>
            </div>

            <ul
              v-if="workoutExercisesLength(exercise.id)"
              v-auto-animate
              class="workout-form__sets"
            >
              <li class="workout-form__sets-header">
                <div />
                <div class="workout-form__sets-header--weight">
                  Вес
                </div>
                <div class="workout-form__sets-header--repeats">
                  Repeats
                </div>
                <div class="workout-form__sets-header--delete" />
              </li>
              <li
                v-for="set in workoutExercises.find(e => e.exerciseId === exercise.id)?.sets"
                :key="set.id"
                class="workout-form__sets-item"
              >
                <div
                  class="workout-form__sets--difficulty"
                  :data-difficulty="set.difficulty"
                />
                <div class="workout-form__sets--weight">
                  {{ set.weight }}
                </div>
                <div class="workout-form__sets--repeats">
                  {{ set.repeats }}
                </div>
                <TheButton
                  variant="transparent"
                  icon-only
                  @click="emit('removeSet', exercise.id, set.id)"
                >
                  <TheIcon
                    icon-name="xmark"
                    width="16px"
                  />
                </TheButton>
              </li>
            </ul>
          </form>
        </div>
      </li>
    </ul>
    <p
      v-else
      class="exercises-empty"
    >
      Add exercise
    </p>
  </div>
</template>

<style src="./style.css" />
