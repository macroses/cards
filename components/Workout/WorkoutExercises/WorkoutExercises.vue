<script setup lang="ts">
import type { Props } from './workoutExerciseTypes'

const props = defineProps<Props>()

const emit = defineEmits<{
  toggleExercise: [id: number]
  removeExercise: [id: number]
  addSet: [id: number]
  removeSet: [exerciseId: number, setId: string]
}>()

const isWorkoutSetValid = ref(false)

const workoutSetRules = [
  createValidationRule('numbersOnly'),
  createValidationRule('maxLength', 5),
]

function getExerciseData(exerciseId: number) {
  return props.exerciseData.get(exerciseId) || {
    currentWeight: '',
    currentRepeats: '',
    currentDifficulty: 1,
  }
}

function workoutExercisesLength(id: number): number {
  return props.workoutExercises.find(e => e.exerciseId === id)?.sets.length || 0
}
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
        <span>{{ exercise.name }}</span>
        <div class="workout__exercise-tonnage" />
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
        <form class="exercise-form">
          <div class="exercise-form__main">
            <TheInput
              v-model.number="getExerciseData(exercise.id).currentWeight"
              placeholder="Вес"
              :validate-rules="workoutSetRules"
              @keydown="onlyNumbers($event)"
              @validation="isWorkoutSetValid = $event"
            />
            <TheInput
              v-model.number="getExerciseData(exercise.id).currentRepeats"
              placeholder="Повторения"
              :validate-rules="workoutSetRules"
              @keydown="onlyNumbers($event)"
              @validation="isWorkoutSetValid = $event"
            />
          </div>
          <div class="exercise-form__submit">
            <WorkoutDifficulty
              v-model="getExerciseData(exercise.id).currentDifficulty"
            />
            <TheButton @click="emit('addSet', exercise.id)">
              Append
            </TheButton>
          </div>

          <ul
            v-if="workoutExercisesLength(exercise.id)"
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
              <div class="workout-form__sets--difficulty">
                {{ set.difficulty }}
              </div>
              <div class="workout-form__sets--weight">
                {{ set.weight }}
              </div>
              <div class="workout-form__sets--repeats">
                {{ set.repeats }}
              </div>
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
</template>

<style src="./style.css" />
