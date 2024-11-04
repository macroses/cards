<script setup lang="ts">
import { useExerciseManagement } from '~/composables/exerciseManagment/useExerciseManagment'
import type { WorkoutSet } from '~/types/Workout'
import type Workout from '~/types/Workout'

const {
  selectedExercisesList,
  activeExerciseId,
  exerciseData,
  selectExercise,
  removeExercise,
  toggleExercise,
} = useExerciseManagement()

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())
const workout = reactive<Workout>({
  title: '',
  color: '213, 0, 0',
  exercises: [],
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

function addSet(exerciseId: number) {
  const data = exerciseData.get(exerciseId)
  if (data?.currentWeight && data?.currentRepeats) {
    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      weight: Number(data.currentWeight),
      repeats: Number(data.currentRepeats),
      difficulty: data.currentDifficulty || 1,
    }

    const exerciseIndex = workout.exercises.findIndex(e => e.exerciseId === exerciseId)
    if (exerciseIndex === -1) {
      workout.exercises.push({
        exerciseId,
        sets: [newSet],
      })
    }
    else {
      workout.exercises[exerciseIndex].sets.push(newSet)
    }

    data.currentWeight = ''
    data.currentRepeats = ''
    data.currentDifficulty = 1
  }
}

function getExerciseSets(exerciseId: number) {
  const exercise = workout.exercises.find(e => e.exerciseId === exerciseId)
  return exercise?.sets || []
}

function removeSet(exerciseId: number, setId: string) {
  const exerciseIndex = workout.exercises.findIndex(e => e.exerciseId === exerciseId)
  if (exerciseIndex !== -1) {
    const exercise = workout.exercises[exerciseIndex]
    exercise.sets = exercise.sets.filter(set => set.id !== setId)

    // Если сетов больше нет, удаляем упражнение из списка
    if (exercise.sets.length === 0) {
      workout.exercises.splice(exerciseIndex, 1)
    }
  }
}
</script>

<template>
  <div class="workout">
    <div class="workout-data">
      {{ workout }}
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
                  v-model.number="(exerciseData.get(exercise.id).currentWeight)"
                  placeholder="Вес"
                />
                <TheInput
                  v-model.number="exerciseData.get(exercise.id).currentRepeats"
                  placeholder="Повторения"
                />
                <select
                  v-model="exerciseData.get(exercise.id).currentDifficulty"
                  class="difficulty-select"
                >
                  <option value="1">
                    1
                  </option>
                  <option value="2">
                    2
                  </option>
                  <option value="3">
                    3
                  </option>
                  <option value="4">
                    4
                  </option>
                  <option value="5">
                    5
                  </option>
                </select>
              </div>
              <button @click="addSet(exercise.id)">
                Добавить
              </button>
            </div>
          </div>
          <table v-if="getExerciseSets(exercise.id).length">
            <tr v-for="set in getExerciseSets(exercise.id)" :key="set.id">
              <td>{{ set.weight }}</td>
              <td>{{ set.repeats }}</td>
              <td>{{ set.difficulty }}/5</td>
              <td>
                <TheButton
                  variant="ghost"
                  icon-only
                  @click="removeSet(exercise.id, set.id)"
                >
                  <TheIcon
                    icon-name="xmark"
                    width="16px"
                  />
                </TheButton>
              </td>
            </tr>
          </table>
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
