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
</script>

<template>
  <div class="workout">
    <div class="workout-data">
      <div class="workout__description">
        {{ formattedDate(selectedDate) }}
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
        v-auto-animate
        class="workout__exercises"
      >
        <li
          v-for="exercise in selectedExercisesList"
          :key="exercise.id"
          class="workout__exercises-item"
        >
          {{ exercise.name }}
          <TheButton
            variant="transparent"
            icon-only
            @click="removeExercise(exercise.id)"
          >
            <TheIcon
              icon-name="xmark"
              width="20px"
            />
          </TheButton>
        </li>
      </ul>
    </div>
    <ExercisesList
      :selected-exercises="selectedExercisesList"
      @select-exercise="selectExercise"
    />
  </div>
</template>
