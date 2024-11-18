<script setup lang="ts">
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import type { UserTrainingSession, UserWorkoutExercise } from '~/ts/interfaces'

const props = defineProps<{
  selectedExercises: UserWorkoutExercise[]
  sessions: UserTrainingSession
}>()

const emit = defineEmits<{
  (event: 'removeExercise', id: number): void
  (event: 'addSet', exerciseForm: ExerciseFormData): void
  (event: 'removeSet', setId: string): void
}>()

interface ExerciseFormData {
  id: string
  exerciseId: number
  weight: number | null
  repeats: number | null
  difficulty: DIFFICULT_LEVEL
}

const exerciseForm = reactive({
  weight: null,
  repeats: null,
  difficulty: DIFFICULT_LEVEL.WARM,
})

const activeExerciseId = ref<number | null>(null)

function toggleExercise(exerciseId: number) {
  resetExerciseForm()
  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
}

function resetExerciseForm() {
  exerciseForm.weight = null
  exerciseForm.repeats = null
  exerciseForm.difficulty = DIFFICULT_LEVEL.WARM
}

function appendSession(exerciseId: number) {
  emit('addSet', {
    id: crypto.randomUUID(),
    exerciseId,
    weight: exerciseForm.weight,
    repeats: exerciseForm.repeats,
    difficulty: exerciseForm.difficulty,
  })
}

function getExerciseSessions(exerciseId: number) {
  return props.sessions.filter(session => session.exerciseId === exerciseId)
}
</script>

<template>
  <div
    v-auto-animate
    class="workout-exercises-wrapper"
  >
    <ul
      v-if="selectedExercises.length"
      v-auto-animate
      class="workout__exercises"
    >
      <li
        v-for="exercise in selectedExercises"
        :key="exercise.id"
        class="workout__exercises-item"
        :class="{ active: activeExerciseId === exercise.id }"
      >
        <div
          class="workout__exercises-item-name"
          @click.stop="toggleExercise(exercise.id)"
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
            @submit.prevent="appendSession(exercise.id)"
          >
            <div class="exercise-form__main">
              <TheInput
                v-model.number="exerciseForm.weight"
                placeholder="Вес"
                type="number"
                inputmode="numeric"
                no-clear
              />
              <TheInput
                v-model.trim.number="exerciseForm.repeats"
                placeholder="Повторения"
                type="number"
                inputmode="numeric"
                no-clear
              />
            </div>
            <div class="exercise-form__submit">
              <WorkoutDifficulty
                v-model="exerciseForm.difficulty"
              />
              <TheButton
                type="submit"
              >
                Добавить сет
              </TheButton>
            </div>

            <ul
              v-if="getExerciseSessions(exercise.id).length"
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
                v-for="set in getExerciseSessions(exercise.id)"
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
                  @click="emit('removeSet', set.id)"
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
