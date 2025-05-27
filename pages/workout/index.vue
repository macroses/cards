<script setup lang="ts">
import type { TrainingSession, WorkoutExercise } from '~/ts'
import type { UserWorkout } from '~/ts/interfaces'
import ExercisesList from '@/components/Exercises/ExerrcisesList/ExercisesList.vue'
import MyExercises from '@/components/Exercises/MyExercises/MyExercises.vue'
import { WORKOUT_COLORS } from '~/constants'

definePageMeta({
  middleware: ['workout-access'],
  auth: true,
})

const { t } = useI18n()

const {
  isCalendarVisible,
  toggleCalendar,
  selectedDate,
} = useToggleCalendar()

const { submitWorkout } = useSubmitWorkout()

const workout = reactive<UserWorkout>({
  title: '',
  color: WORKOUT_COLORS[0].rgb,
  exercises: [],
  sessions: [],
  workoutDate: new Date(selectedDate.value.setHours(12, 0, 0, 0)),
  startedAt: null,
  endedAt: null,
  completed: false,
})

const { editableWorkout, initEditMode } = useEditWorkout(workout)
const { selectExercise } = useSelectExercise()
const { getLastSets } = useLastExerciseSets()
const { exercisesList } = useFetchExercisesList()

const isExercisesList = shallowRef(true)
const exercisesListRef = useTemplateRef<HTMLDivElement>('exercisesListRef')

async function handleSelectExercise(exercise: WorkoutExercise): Promise<void> {
  if (!document.startViewTransition) {
    await selectExercise(exercise, workout)
    return
  }

  const transition = document.startViewTransition(async () => {
    await nextTick()
    await selectExercise(exercise, workout)
  })

  await transition.finished
}

function handleRemoveExercise(exerciseId: string): void {
  workout.exercises = workout.exercises.filter((exercise: WorkoutExercise) => exercise.id !== exerciseId)
  workout.sessions = workout.sessions.filter((session: TrainingSession) => session.exerciseId !== exerciseId)
}

function handleAddSet(set: TrainingSession) {
  const sessionSet: TrainingSession = {
    ...set,
    setTime: set.setTime ? Number(set.setTime) : null,
    setTimeAddedAt: null,
  }

  workout.sessions.push(sessionSet)
}

function handleRemoveSet(setId: string) {
  workout.sessions = workout.sessions.filter((session: TrainingSession) => session.id !== setId)
}

const isMobileListVisible = shallowRef(false)
const isMobile = useMediaQuery('(max-width: 768px)')

async function toggleMobileList() {
  if (!document.startViewTransition) {
    isMobileListVisible.value = !isMobileListVisible.value
    return
  }

  await document.startViewTransition(() => {
    isMobileListVisible.value = !isMobileListVisible.value
  }).finished
}

const isWorkoutValid = computed(() => {
  if (!workout.exercises.length) {
    return
  }

  const exercisesWithSets = workout.exercises.some((exercise) => {
    return workout.sessions.some(session => session.exerciseId === exercise.id)
  })

  return exercisesWithSets && workout.title
})

const chosenExercisesList = computed(() => {
  return isExercisesList.value ? ExercisesList : MyExercises
})

watch(selectedDate, (newDate: Date) => {
  workout.workoutDate = new Date(newDate.setHours(12, 0, 0, 0))

  for (const exercise of workout.exercises) {
    getLastSets(exercise.id, workout.workoutDate)
  }
})

watch(isMobile, (mobile) => {
  if (mobile) {
    isMobileListVisible.value = false
  }
})

onMounted(async () => {
  await initEditMode()
})

useHead({
  title: computed(() => t('pages.create_workout')),
})

onClickOutside(exercisesListRef, async () => {
  await toggleMobileList()
})
</script>

<template>
  <WorkoutWrapper>
    <template #description>
      <WorkoutDescription
        :selected-date="selectedDate"
        :title="editableWorkout?.title"
        :color="editableWorkout?.color"
        @workout-title="workout.title = $event"
        @workout-color="workout.color = $event"
        @toggle-calendar="toggleCalendar"
      />
      <Calendar
        v-if="isCalendarVisible"
        v-model="selectedDate"
      />
    </template>
    <template #workout-exercises>
      <WorkoutExercises
        :sessions="workout.sessions"
        :selected-exercises="workout.exercises"
        :workout-date="workout.workoutDate"
        @remove-exercise="handleRemoveExercise"
        @add-set="handleAddSet"
        @remove-set="handleRemoveSet"
      />
      <TheButton
        v-if="isWorkoutValid"
        @click="submitWorkout(workout)"
      >
        {{ $t('workout.save_workout') }}
      </TheButton>
    </template>
    <template #exercises-list>
      <ClientOnly>
        <div
          v-if="!isMobile || isMobileListVisible"
          ref="exercisesListRef"
          class="muscles-list"
        >
          <button
            v-if="isMobile && isMobileListVisible"
            variant="transparent"
            icon-only
            class="close-exercises-list"
            @click="toggleMobileList"
          >
            <TheIcon
              icon-name="angle-down"
              width="25"
            />
          </button>
          <div class="tabs-container">
            <TheButton
              :variant="isExercisesList ? 'primary' : 'secondary'"
              @click="isExercisesList = true"
            >
              {{ $t('exercises.all_exercises') }}
            </TheButton>
            <TheButton
              :variant="isExercisesList ? 'secondary' : 'primary'"
              @click="isExercisesList = false"
            >
              {{ $t('exercises.my_exercises') }}
            </TheButton>
          </div>
          <Component
            :is="chosenExercisesList"
            :selected-exercises="workout.exercises"
            :exercises-list="exercisesList"
            @remove-exercise="handleRemoveExercise"
            @select-exercise="handleSelectExercise"
          />
        </div>
        <TheButton
          v-if="isMobile && !isMobileListVisible"
          class="show-exercises-list"
          :style="{ viewTransitionName: 'exercises-list' }"
          @click="toggleMobileList"
        >
          {{ $t('exercises.exercises') }}
          <TheIcon
            icon-name="angle-down"
            width="14"
          />
        </TheButton>
      </ClientOnly>
    </template>
  </WorkoutWrapper>
</template>
