<script setup lang="ts">
import type {
  TrainingSession,
  WorkoutExercise,
} from '~/ts'

const props = defineProps<{
  selectedExercises: WorkoutExercise[]
  sessions: TrainingSession[]
  workoutDate: Date
}>()

const emit = defineEmits<{
  (event: 'removeExercise', id: string): void
  (event: 'addSet', exerciseForm: TrainingSession): void
  (event: 'removeSet', setId: string): void
}>()

const activeExerciseId = shallowRef<string | null>(null)
const showLastSessions = shallowRef<string | null>(null)
const lastSessionsRef = useTemplateRef<HTMLDivElement>('lastSessionsRef')

const { lastSets, getLastSets } = useLastExerciseSets()

const hasPreviousSets = computed(() => {
  return (exerciseId: string) => {
    return lastSets.value[exerciseId]?.length > 0
  }
})

function toggleExercise(exerciseId: string) {
  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
}

function handleDeleteExercise(exerciseId: string) {
  emit('removeExercise', exerciseId)
  activeExerciseId.value = null
  showLastSessions.value = null
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
          :style="{ '--exercise-transition-name': `exercise-${exercise.id}` }"
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

        <ExerciseForm
          :exercise-id="exercise.id"
          :sessions="sessions"
          @add-set="emit('addSet', $event)"
          @remove-set="emit('removeSet', $event)"
        />
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
