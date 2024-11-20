<script setup lang="ts">
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'
import type {
  ExerciseFormData,
  UserTrainingSession,
  UserWorkoutExercise,
} from '~/ts/interfaces'

const props = defineProps<{
  selectedExercises: UserWorkoutExercise[]
  sessions: UserTrainingSession[]
  workoutDate: Date
}>()

const emit = defineEmits<{
  (event: 'removeExercise', id: number): void
  (event: 'addSet', exerciseForm: ExerciseFormData): void
  (event: 'removeSet', setId: string): void
}>()

const exerciseForm = reactive({
  weight: null,
  repeats: null,
  difficulty: DIFFICULT_LEVEL.WARM,
})

const activeExerciseId = ref<number | null>(null)
const showLastSessions = ref<number | null>(null)
const lastSessionsRef = ref(null)

const { lastSets } = useLastExerciseSets()

const hasPreviousSets = computed(() => {
  return (exerciseId: number) => {
    return lastSets.value[exerciseId]?.length > 0
  }
})

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
  return props.sessions.filter((session: UserTrainingSession) => session.exerciseId === exerciseId)
}

function showPreviousSetsResults(exerciseId: number | null) {
  showLastSessions.value = showLastSessions.value === exerciseId ? null : exerciseId
}

onClickOutside(lastSessionsRef, () => showLastSessions.value = null)
</script>

<template>
  <div
    v-auto-animate
    class="workout-exercises-wrapper"
  >
    <WorkoutTonnage
      :sessions
      :selected-exercises-length="selectedExercises.length"
    />
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
          <div
            ref="lastSessionsRef"
            class="workout__exercises-item-functions"
          >
            <TheButton
              v-if="hasPreviousSets(exercise.id)"
              v-tooltip="'Previous results'"
              variant="transparent"
              icon-only
              @click.stop="showPreviousSetsResults(exercise.id)"
            >
              <TheIcon
                icon-name="clock-rotate-left"
                width="14px"
              />
            </TheButton>
            <TheButton
              v-tooltip="{ content: 'Подсказка слева', position: 'left' }"
              variant="transparent"
              icon-only
              @click="emit('removeExercise', exercise.id)"
            >
              <TheIcon
                icon-name="xmark"
                width="14px"
              />
            </TheButton>

            <div
              v-auto-animate
              class="last-sessions-wrapper"
            >
              <WorkoutLastSessions
                :exercise-id="exercise.id"
                :active-exercise-id="activeExerciseId"
                :workout-date="workoutDate"
                :show-sessions="showLastSessions === exercise.id"
              />
            </div>
          </div>
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
              <WorkoutDifficulty v-model="exerciseForm.difficulty" />
              <TheButton type="submit">
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
