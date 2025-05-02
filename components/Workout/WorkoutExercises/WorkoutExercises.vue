<script setup lang="ts">
import type {
  UserTrainingSession,
  UserWorkoutExercise,
} from '~/ts/interfaces'
import { nanoid } from 'nanoid'
import { MAX_LENGTH_NUMBER } from '~/constants'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

const props = defineProps<{
  selectedExercises: UserWorkoutExercise[]
  sessions: UserTrainingSession[]
  workoutDate: Date
}>()

const emit = defineEmits<{
  (event: 'removeExercise', id: string): void
  (event: 'addSet', exerciseForm: UserTrainingSession): void
  (event: 'removeSet', setId: string): void
}>()

const exerciseForm = reactive<Partial<UserTrainingSession>>({
  weight: 0,
  repeats: 0,
  difficulty: DIFFICULT_LEVEL.WARM,
})

const activeExerciseId = shallowRef<string | null>(null)
const showLastSessions = shallowRef<string | null>(null)
const lastSessionsRef = useTemplateRef<HTMLDivElement>('lastSessionsRef')

const { lastSets, getLastSets } = useLastExerciseSets()

const hasPreviousSets = computed(() => {
  return (exerciseId: string) => {
    return lastSets.value[exerciseId]?.length > 0
  }
})

const isAppendSessionDisable = computed(() => !exerciseForm.weight || !exerciseForm.repeats)

function toggleExercise(exerciseId: string) {
  resetExerciseForm()
  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
}

function handleDeleteExercise(exerciseId: string) {
  emit('removeExercise', exerciseId)
  activeExerciseId.value = null
  showLastSessions.value = null
}

function resetExerciseForm() {
  exerciseForm.weight = 0
  exerciseForm.repeats = 0
  exerciseForm.difficulty = DIFFICULT_LEVEL.WARM
}

function appendSession(exerciseId: string) {
  if (!exerciseForm.weight || !exerciseForm.repeats) {
    return
  }

  emit('addSet', {
    id: nanoid(),
    exerciseId,
    weight: exerciseForm.weight,
    repeats: exerciseForm.repeats,
    difficulty: exerciseForm.difficulty,
    completed: false,
    setTime: null,
  } as UserTrainingSession)
}

function getExerciseSessions(exerciseId: string) {
  return props.sessions.filter((session: UserTrainingSession) => session.exerciseId === exerciseId)
}

function isLastWorkoutResultsVisible(exerciseId: string) {
  return lastSets.value[exerciseId] && showLastSessions.value === exerciseId
}

function showPreviousSetsResults(exerciseId: string | null) {
  showLastSessions.value = showLastSessions.value === exerciseId ? null : exerciseId
}

onMounted(() => {
  props.selectedExercises.forEach((exercise) => {
    getLastSets(exercise.id, props.workoutDate)
  })
})

watch(() => props.selectedExercises, (exercises) => {
  exercises.forEach((exercise) => {
    if (!lastSets.value[exercise.id]) {
      getLastSets(exercise.id, props.workoutDate)
    }
  })
}, { deep: 1 })
</script>

<template>
  <div class="workout-exercises-wrapper">
    <WorkoutTonnage
      :sessions
      :selected-exercises-length="selectedExercises.length"
    />
    <ul
      v-if="selectedExercises.length"
      v-auto-animate="{ duration: 100 }"
      class="workout__exercises"
    >
      <li
        v-for="exercise in selectedExercises"
        :key="exercise.id"
        v-auto-animate="{ duration: 100 }"
        class="workout__exercises-item"
        :class="{ active: activeExerciseId === exercise.id }"
      >
        <div
          class="workout__exercises-item-name"
          :style="{ viewTransitionName: `exercise-${exercise.id}` }"
          @click.stop="toggleExercise(exercise.id)"
        >
          <TheIcon
            icon-name="angle-down"
            width="14"
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
              :variant="showLastSessions === exercise.id ? 'success' : 'transparent'"
              icon-only
              @click.stop="showPreviousSetsResults(exercise.id)"
            >
              <TheIcon
                icon-name="clock-rotate-left"
                width="14"
              />
            </TheButton>
            <TheButton
              variant="transparent"
              icon-only
              @click.stop="handleDeleteExercise(exercise.id)"
            >
              <TheIcon
                icon-name="xmark"
                width="14"
              />
            </TheButton>
          </div>
        </div>

        <WorkoutLastSessions
          v-if="isLastWorkoutResultsVisible(exercise.id)"
          :exercise-id="exercise.id"
          :active-exercise-id="activeExerciseId"
          :workout-date="workoutDate"
          :last-sets="lastSets[exercise.id]"
          class="last-sessions-wrapper"
        />

        <div class="exercise-form__wr">
          <form
            v-auto-animate="{ duration: 100 }"
            class="exercise-form"
            @submit.prevent="appendSession(exercise.id)"
          >
            <div class="exercise-form__main">
              <TheInput
                v-model.number="exerciseForm.weight"
                placeholder="Вес"
                type="number"
                :max="MAX_LENGTH_NUMBER"
                inputmode="numeric"
                no-clear
              />
              <TheInput
                v-model.number="exerciseForm.repeats"
                placeholder="Повторения"
                type="number"
                :max="MAX_LENGTH_NUMBER"
                inputmode="numeric"
                no-clear
              />
              <TheButton
                type="submit"
                :disabled="isAppendSessionDisable"
              >
                Добавить
              </TheButton>
            </div>
            <ul
              v-if="getExerciseSessions(exercise.id).length"
              v-auto-animate="{ duration: 100 }"
              class="workout-form__sets"
            >
              <li class="workout-form__sets-header">
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
                    width="16"
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
      {{ $t('workout.add_exercise') }}
      <TheIcon
        icon-name="list-check"
        width="20"
      />
    </p>
  </div>
</template>

<style src="./style.css" />
