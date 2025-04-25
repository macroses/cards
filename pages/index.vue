<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { ChartsApiResponse, CreateWorkoutResponse, Statistics } from '~/ts/interfaces'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { GLOBAL_DATE, GLOBAL_WORKOUTS, KEYS, PAGES } from '~/constants'

dayjs.extend(duration)

definePageMeta({ auth: true })

const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)
const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS)
const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA)
const isCopyMode = ref(false)
const workoutToCopy = ref<string | null>(null)
const isLoading = ref(true)

const localePath = useLocalePath()
const { deleteWorkout } = useDeleteWorkout()
const { copyWorkout } = useCopyWorkout()
const { refresh: refreshStats, statistics } = useGlobalStatistics()
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
  navigateTo(localePath(`${PAGES.WORKOUT}/?edit=${selectedWorkout.value?.id}`))
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
  isCopyMode.value = false

  // Проверяем, является ли удаляемая тренировка активной
  if (activeWorkout.value?.id === id) {
    const cache = await caches.open('workout-cache-v1')
    const cacheKey = new URL(`workout-${id}`, window.location.origin).toString()
    await cache.delete(cacheKey)
  }

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

useHead({
  title: 'Home',
})

const { isLoading: isWorkoutsLoading } = useFetchWorkoutsByUserId()
const { isLoading: statsStatus } = useGlobalStatistics()
const { isLoading: chartsStatus } = useGlobalCharts()

watch(
  [workouts, isWorkoutsLoading, statsStatus, chartsStatus],
  ([workoutsValue, isLoadingValue, statsStatusValue, chartsStatusValue]) => {
    if (
      workoutsValue
      && !isLoadingValue
      && !statsStatusValue
      && !chartsStatusValue
    ) {
      isLoading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <TheLoader v-if="isLoading" />
  <div
    v-else
    class="home-page__container"
  >
    <div class="home-page__calendar">
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
        <GlobalStatistics :statistics />
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
            width="20"
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
        <FinishedWorkoutResult
          v-if="selectedWorkout"
          v-model:selected-exercise-id="selectedExerciseId"
          :selected-workout="selectedWorkout"
        />
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
</style>
