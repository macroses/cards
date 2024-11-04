<script setup lang="ts">
import type Exercise from '~/types/Exercise'
import type Workout from '~/types/Workout'

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
const workout = reactive<Workout>({
  title: '',
  color: '213, 0, 0',
  weight: null,
  repeats: null,
  effort: 0,
  workoutDate: new Date(selectedDate.value.setHours(12, 0, 0, 0)),
})

const isWorkoutNameValid = ref(false)

const workoutNameRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 50),
]

function getColor(color: string) {
  workout.color = color
}

const selectedExercisesList = ref<Exercise[]>([])
function selectExercise(exercise: Exercise) {
  const isExerciseExists = selectedExercisesList.value?.some(
    (existingExercise: Exercise) => existingExercise.id === exercise.id,
  )

  if (!isExerciseExists) {
    selectedExercisesList.value?.push(exercise)
  }
}

function removeExercise(exerciseId: number) {
  selectedExercisesList.value = selectedExercisesList.value.filter(
    exercise => exercise.id !== exerciseId,
  )
}

const activeExerciseId = ref<number | null>(null)
function toggleExercise(exerciseId: number) {
  activeExerciseId.value = activeExerciseId.value === exerciseId ? null : exerciseId
}
</script>

<template>
  <div class="workout">
    <div class="workout-data">
      <div class="workout__description">
        <div class="workout__name">
          <TheInput
            v-model="workout.title"
            placeholder="Workout name"
            :validate-rules="workoutNameRules"
            @validation="isWorkoutNameValid = $event"
          />
          <TheDropdpownColor @drop-color="getColor" />
        </div>
      </div>

      <ul
        v-if="selectedExercisesList.length"
        v-auto-animate
        class="workout__exercises"
      >
        <li
          v-for="exercise in selectedExercisesList"
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
            {{ exercise.name }}
            <TheButton
              variant="ghost"
              icon-only
              @click="removeExercise(exercise.id)"
            >
              <TheIcon
                icon-name="xmark"
                width="14px"
                :style="{ color: 'rgb(var(--text-color))' }"
              />
            </TheButton>
          </div>

          <div class="exercise-form__wr">
            <div class="exercise-form">
              <div class="exercise-form__main">
                <TheInput
                  placeholder="Weight"
                />
                <TheInput
                  placeholder="Repeats"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>

      <p v-else>
        Add exercise
      </p>

      <!--      {{ formattedDate(selectedDate) }} -->
    </div>
    <ExercisesList
      :selected-exercises="selectedExercisesList"
      @select-exercise="selectExercise"
    />
  </div>
</template>
