<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { WorkoutResponse } from '~/ts'
import type { ChartsApiResponse, Statistics } from '~/ts/interfaces'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { GLOBAL_DATE, KEYS, PAGES } from '~/constants'

dayjs.extend(duration)

const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<WorkoutResponse[] | null>(KEYS.GLOBAL_WORKOUTS, () => null)
const globalStats = useState<Statistics | null>(KEYS.GLOBAL_STATISTICS)
const chartsState = useState<ChartsApiResponse | null>(KEYS.CHARTS_DATA)
const isCopyMode = shallowRef(false)
const workoutToCopy = shallowRef<string | null>(null)

const { t } = useI18n()

const localePath = useLocalePath()
const { deleteWorkout } = useDeleteWorkout()
const { copyWorkout } = useCopyWorkout()
const { refresh: refreshStats, statistics } = useGlobalStatistics()
const { refresh: refreshCharts } = useGlobalCharts()

const workoutsForSelectedDate = computed(() => {
  return workouts.value?.filter((workout: WorkoutResponse) => {
    return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
  }) || []
})

const activeWorkout = computed(() => {
  return workouts.value?.find((workout: WorkoutResponse) =>
    workout.startedAt && !workout.endedAt,
  ) || null
})

const modalSelectedWorkoutId = shallowRef<string | null>(null)

const selectedWorkout = computed(() => {
  if (modalSelectedWorkoutId.value) {
    return workouts.value?.find(({ id }) => id === modalSelectedWorkoutId.value) || workoutsForSelectedDate.value[0]
  }

  return workoutsForSelectedDate.value[0]
})

function isWorkoutActiveForId(id: string): boolean {
  return activeWorkout.value?.id === id
}

const MIN_WORKOUTS = 5
const isChartsVisible = useStorage('charts-disabled', false)
const isStatisticVisible = computed(() => {
  const workoutsLength = workouts.value && workouts.value?.filter(workout => workout.completed).length >= MIN_WORKOUTS

  return workoutsLength && !isChartsVisible.value
})

async function toEditPage(id: string) {
  await navigateTo(localePath(`${PAGES.WORKOUT}/?edit=${id}`))
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

  await refreshCharts()
}

const readWorkoutResults = useTemplateRef<typeof TheModal>('readWorkoutResults')
const selectedExerciseId = shallowRef<string | null>(null)
const isMobileChartsVisible = shallowRef(false)
const isMobile = useMediaQuery('(max-width: 768px)')

function showResultModal(workoutId: string) {
  readWorkoutResults.value?.openModal()
  modalSelectedWorkoutId.value = workoutId

  const workout = workouts.value?.find(({ id }) => id === workoutId)
  if (workout?.exercises.length) {
    selectedExerciseId.value = workout.exercises[0].exerciseId
  }
}

useHead({
  title: computed(() => t('pages.home')),
})

const { isLoading: isWorkoutsLoading } = useFetchWorkoutsByUserId()

const isPageLoading = computed(() => {
  return !workouts.value || isWorkoutsLoading.value
})

onMounted(() => {
  if (!workouts.value) {
    return
  }

  if (workouts.value.length >= 5 && !globalStats.value) {
    refreshStats()
  }
})

function setDateByChart(date: string) {
  const [day, month, year] = date.split('.')
  const formattedDate = `${year}-${month}-${day}`

  selectedDate.value = dayjs(formattedDate).toDate()
}
</script>

<template>
  <TheLoader v-if="isPageLoading" />
  <div
    v-else
    class="home-page__container"
  >
    <div class="home-page__calendar">
      <ContainerUI
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
      </ContainerUI>
    </div>

    <div
      v-if="isStatisticVisible"
      class="dashboard__charts"
      style="view-transition-name: dashboard-charts"
    >
      <DashboardCharts @chart-date="setDateByChart" />
    </div>

    <div
      v-if="isStatisticVisible"
      class="global-statistics__wr"
      style="view-transition-name: global-statistics"
    >
      <GlobalStatistics :statistics />
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
      <template #header>
        <div class="workout-results__header">
          <TheButton
            v-if="isMobile && isMobileChartsVisible"
            icon-only
            class="workout-results__back-button"
            @click="isMobileChartsVisible = false"
          >
            <TheIcon
              icon-name="angle-left"
              width="20"
            />
          </TheButton>
          <h3>
            {{ selectedWorkout.title }}
            <span>{{ dayjs(selectedWorkout.workoutDate).format('DD.MM.YYYY') }}</span>
          </h3>
        </div>
      </template>
      <template #content>
        <FinishedWorkoutResult
          v-if="selectedWorkout"
          v-model:selected-exercise-id="selectedExerciseId"
          v-model:is-charts-visible="isMobileChartsVisible"
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

.workout-results__header {
  position: relative;
}

.workout-results__back-button {
  position: absolute;
  right: 0;
  top: -4px;
  z-index: 10;
}
</style>
