<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { GLOBAL_DATE, GLOBAL_WORKOUTS } from '~/constants'
import type { CreateWorkoutResponse } from '~/ts/interfaces'

dayjs.extend(duration)

definePageMeta({ auth: true })

const selectedDate = useState<Date>(GLOBAL_DATE, () => new Date())
const workouts = useState<CreateWorkoutResponse[] | null>(GLOBAL_WORKOUTS, () => null)
const isCopyMode = ref(false)
const workoutToCopy = ref<string | null>(null)

const localePath = useLocalePath()
const { deleteWorkout } = useDeleteWorkout()
const { copyWorkout } = useCopyWorkout()

const selectedWorkout = computed(() => {
  return workouts.value?.find((workout: CreateWorkoutResponse) => {
    return dayjs(workout.workoutDate).isSame(selectedDate.value, 'day')
  })
})

const isWorkoutActive = computed(() => {
  return Boolean(selectedWorkout.value?.startedAt && !selectedWorkout.value.endedAt)
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

function handleDeleteWorkout(id: string) {
  isCopyMode.value = false
  deleteWorkout(id)
}

const readWorkoutResults = ref<typeof TheModal | null>(null)
const selectedExerciseId = ref<number | null>(null)

function showResultModal() {
  readWorkoutResults.value?.openModal()
  if (selectedWorkout.value?.exercises.length) {
    selectedExerciseId.value = selectedWorkout.value.exercises[0].exerciseId
  }
}

function handleExerciseClick(exerciseId: number) {
  selectedExerciseId.value = exerciseId
}

const exerciseSets = computed(() => {
  if (!selectedWorkout.value) {
    return {} as Record<number, CreateWorkoutResponse['sets']>
  }

  return selectedWorkout.value.sets.reduce((
    acc: Record<number, CreateWorkoutResponse['sets']>,
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
    <div class="home-page__calendar">
      <div v-auto-animate class="calendar-wrap">
        <Calendar
          v-model="selectedDate"
          :workouts="workouts"
          :copy-mode="isCopyMode"
          @date-select="handleDateSelect"
        />
        <MainNavigation />
        <LazyWorkoutFunctions
          v-if="selectedWorkout"
          :workout-title="selectedWorkout.title"
          :workout-id="selectedWorkout.id"
          :is-workout-completed="selectedWorkout.completed"
          :is-copy-mode="isCopyMode"
          :is-workout-active="isWorkoutActive"
          :inert="isCopyMode"
          :class="{ copyWorkout: isCopyMode }"
          @update-workout="toEditPage"
          @delete-workout="handleDeleteWorkout(selectedWorkout.id)"
          @copy-workout="handleCopyWorkout"
          @open-results="showResultModal"
        />
      </div>
    </div>

    <div v-if="workouts" class="dashboard__charts">
      <DashboardCharts :workouts="workouts" />
    </div>

    <Transition>
      <div
        v-if="isCopyMode"
        class="copy-mode__popup"
      >
        {{ $t('workout.selectDateToCopy') }}
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
                <table class="workout-results__sets">
                  <thead>
                    <tr>
                      <th>Weight</th>
                      <th>Repeats</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tr
                    v-for="set in exerciseSets[exercise.exerciseId]"
                    :key="set.id"
                    class="workout-results__set"
                    :class="`difficulty-${set.difficulty}`"
                  >
                    <td>{{ set.weight }}</td>
                    <td>{{ set.repeats }}</td>
                    <td>{{ setTime(set.setTime) }}</td>
                  </tr>
                </table>
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

.dashboard__charts {
  border-radius: 8px;
  padding: 1rem;
}

.copy-mode__popup {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
</style>
