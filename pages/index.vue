<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import TheModal from '~/components/ui/TheModal/TheModal.vue'
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
function showResultModal() {
  readWorkoutResults.value?.openModal()
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

    <Transition>
      <div
        v-if="isCopyMode"
        v-auto-animate
        class="copy-mode__popup"
      >
        Выберите дату для копирования
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

    <TheModal
      ref="readWorkoutResults"
      class="workout-results__modal"
    >
      <template #content>
        <div class="workout-results__container">
          <ul class="workout-results">
            <li
              v-for="exercise in selectedWorkout?.exercises"
              :key="exercise.exerciseId"
              class="workout-results__exercise"
            >
              <div
                class="workout-results__exercise-name"
              >
                {{ exercise.exerciseName }}
              </div>
              <table class="workout-results__sets">
                <thead>
                  <tr>
                    <th>Difficulty</th>
                    <th>Weight</th>
                    <th>Repeats</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tr
                  v-for="set in exerciseSets[exercise.exerciseId]"
                  :key="set.id"
                  class="workout-results__set"
                >
                  <td>
                    <div
                      class="workout-results__set-difficulty"
                      :class="`difficulty-${set.difficulty}`"
                    >
                      {{ set.difficulty }}
                    </div>
                  </td>
                  <td>{{ set.weight }}</td>
                  <td>{{ set.repeats }}</td>
                  <td>{{ setTime(set.setTime) }}</td>
                </tr>
              </table>
            </li>
          </ul>

          <WorkoutResults
            v-if="selectedWorkout"
            :workout="selectedWorkout"
          />
        </div>
      </template>
    </TheModal>
  </div>
</template>

<style scoped>
.workout-results__container {
  display: flex;
  gap: 20px;
}

.workout-results {
  flex: 1;
  list-style: none;
  padding: 0;
  margin: 0;
}

.workout-results__exercise {
  margin-bottom: 20px;
}

.workout-results__exercise-name {
  font-weight: 600;
  margin-bottom: 10px;
}

.workout-results__sets {
  width: 100%;
  border-collapse: collapse;
}

.workout-results__sets th,
.workout-results__sets td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid var(--table-dark-bg);
}

.workout-results__set-difficulty {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: 600;
  font-size: 12px;
}
</style>
