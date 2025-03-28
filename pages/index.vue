<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { ChartsApiResponse, CreateWorkoutResponse, Statistics } from '~/ts/interfaces'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { GLOBAL_DATE, GLOBAL_WORKOUTS, KEYS } from '~/constants'

dayjs.extend(duration)

definePageMeta({ auth: true })

const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)
const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS)
const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA)
const isCopyMode = ref(false)
const workoutToCopy = ref<string | null>(null)

const localePath = useLocalePath()
const { deleteWorkout } = useDeleteWorkout()
const { copyWorkout } = useCopyWorkout()
const { refresh: refreshStats } = useGlobalStatistics()
const { refresh: refreshCharts } = useGlobalCharts()

const workoutsForSelectedDate = computed(() => {
  return workouts.value?.filter((workout: CreateWorkoutResponse) => {
    return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
  }) || []
})

const activeWorkout = computed(() => {
  return workouts.value?.find((workout: CreateWorkoutResponse) =>
    workout.startedAt && !workout.endedAt,
  ) || null
})

const selectedWorkout = computed(() => workoutsForSelectedDate.value[0])

function isWorkoutActiveForId(id: string): boolean {
  return activeWorkout.value?.id === id
}

const MIN_WORKOUTS = 5
const isChartsVisible = useStorage('charts-disabled', false)
const isStatisticVisible = computed(() => {
  const workoutsLength = workouts.value && workouts.value?.filter(workout => workout.completed).length >= MIN_WORKOUTS

  return workoutsLength && !isChartsVisible.value
})

function toEditPage(): void {
  navigateTo(localePath(`/workout/?edit=${selectedWorkout.value?.id}`))
}

async function handleCopyWorkout(): Promise<void> {
  isCopyMode.value = true
  workoutToCopy.value = selectedWorkout.value?.id || null
}

async function handleDateSelect(date: Date) {
  if (isCopyMode.value && workoutToCopy.value) {
    await copyWorkout(workoutToCopy.value, date)
    isCopyMode.value = false
    workoutToCopy.value = null
  }
}

async function handleDeleteWorkout(id: string) {
  if (activeWorkout.value?.id === id) {
    return
  }

  isCopyMode.value = false
  await deleteWorkout(id)

  globalStats.value = null
  chartsState.value = null

  await refreshStats()
  await refreshCharts()
}

const readWorkoutResults = useTemplateRef<typeof TheModal>('readWorkoutResults')
const selectedExerciseId = ref<string | null>(null)

function showResultModal() {
  readWorkoutResults.value?.openModal()

  if (selectedWorkout.value?.exercises.length) {
    selectedExerciseId.value = selectedWorkout.value.exercises[0].exerciseId
  }
}

function handleExerciseClick(exerciseId: string) {
  selectedExerciseId.value = exerciseId
}

const exerciseSets = computed(() => {
  if (!selectedWorkout.value) {
    return {} as Record<string, CreateWorkoutResponse['sets']>
  }

  return selectedWorkout.value.sets.reduce((
    acc: Record<string, CreateWorkoutResponse['sets']>,
    set: CreateWorkoutResponse['sets'][0],
  ) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = []
    }

    acc[set.exerciseId].push(set)

    return acc
  }, {})
})

function setTime(time: number | null): string {
  if (!time) {
    return ''
  }

  return dayjs.duration(time, 'seconds').format('mm:ss')
}
</script>

<template>
  <div class="home-page__container">
    <div
      class="home-page__calendar"
      style="view-transition-name: calendar-block"
    >
      <div
        v-auto-animate="{ duration: 100 }"
        class="calendar-wrap"
      >
        <Calendar
          v-model="selectedDate"
          :workouts="workouts"
          :copy-mode="isCopyMode"
          @date-select="handleDateSelect"
        />
        <MainNavigation />
        <LazyWorkoutFunctions
          v-for="workout in workoutsForSelectedDate"
          :key="workout.id"
          :workout-title="workout.title"
          :workout-id="workout.id"
          :is-workout-completed="workout.completed"
          :is-copy-mode="isCopyMode"
          :is-workout-active="isWorkoutActiveForId(workout.id)"
          :inert="isCopyMode"
          :class="{ copyWorkout: isCopyMode }"
          @update-workout="toEditPage"
          @delete-workout="handleDeleteWorkout(workout.id)"
          @copy-workout="handleCopyWorkout"
          @open-results="showResultModal"
        />
      </div>
      <div
        v-if="isStatisticVisible"
        class="global-statistics__wr"
        style="view-transition-name: global-statistics"
      >
        <GlobalStatistics :workouts="workouts" />
      </div>
    </div>

    <div
      v-if="isStatisticVisible"
      class="dashboard__charts"
      style="view-transition-name: dashboard-charts"
    >
      <DashboardCharts />
    </div>

    <Transition>
      <div
        v-if="isCopyMode"
        class="copy-mode__popup"
      >
        {{ $t('workout.select_date_to_copy') }}
        <TheButton
          variant="secondary"
          icon-only
          @click="isCopyMode = false"
        >
          <TheIcon
            icon-name="xmark"
            width="20px"
          />
        </TheButton>
      </div>
    </Transition>

    <LazyTheModal
      ref="readWorkoutResults"
      :has-close-button="false"
      class="workout-results__modal"
    >
      <template #content>
        <div class="workout-results__container">
          <div class="workout-results__wr">
            <ul class="workout-results">
              <li
                v-for="exercise in selectedWorkout?.exercises"
                :key="exercise.exerciseId"
                class="workout-results__exercise"
              >
                <div
                  class="workout-results__exercise-name"
                  :class="{ active: selectedExerciseId === exercise.exerciseId }"
                  @click="handleExerciseClick(exercise.exerciseId)"
                >
                  {{ exercise.exerciseName }}
                  <TheButton
                    v-if="selectedExerciseId !== exercise.exerciseId"
                    variant="secondary"
                    icon-only
                    @click="handleExerciseClick(exercise.exerciseId)"
                  >
                    <TheIcon
                      icon-name="angle-right"
                      width="20px"
                    />
                  </TheButton>
                </div>
                <div class="workout-results__sets">
                  <ul class="workout-results__sets-header">
                    <li>Weight</li>
                    <li>Repeats</li>
                    <li>Time</li>
                  </ul>
                  <ul
                    v-for="set in exerciseSets[exercise.exerciseId]"
                    :key="set.id"
                    class="workout-results__set"
                    :class="`difficulty-${set.difficulty}`"
                  >
                    <li>{{ set.weight }}</li>
                    <li>{{ set.repeats }}</li>
                    <li>{{ setTime(set.setTime) }}</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <WorkoutResults
            v-if="selectedWorkout"
            :workout="selectedWorkout"
            :selected-exercise-id="selectedExerciseId"
          />
        </div>
      </template>
    </LazyTheModal>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  padding: 2rem;
}

.dashboard__calendar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

::view-transition-old(dashboard-charts),
::view-transition-old(global-statistics) {
  animation: fade-out 0.3s ease-in-out;
}

::view-transition-new(global-statistics),
::view-transition-new(dashboard-charts) {
  animation: fade-in 0.3s ease-in-out;
}

::view-transition-old(calendar-block) {
  animation: slide-to-center 0.3s ease-in-out;
}

::view-transition-new(calendar-block) {
  animation: slide-from-center 0.3s ease-in-out;
}

@keyframes fade-in {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(50vw - 50%));
  }
}

@keyframes fade-out {
  from {
    transform: translateX(calc(50vw - 50%));
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-to-center {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(50vw - 50%));
  }
}

@keyframes slide-from-center {
  from {
    transform: translateX(calc(50vw - 50%));
  }
  to {
    transform: translateX(0);
  }
}
</style>
