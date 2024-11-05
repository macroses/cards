<script setup lang="ts">
import { useExerciseManagement } from '~/composables/exerciseManagment/useExerciseManagment'
import { useWorkoutSets } from '~/composables/setsManagment/useSetsManagment'
import type Workout from '~/types/Workout'

const selectedDate = useState<Date>('selectedWorkoutDate', () => new Date())

const {
  selectedExercisesList,
  activeExerciseId,
  exerciseData,
  selectExercise,
  removeExercise,
  toggleExercise,
} = useExerciseManagement()

const workout = reactive<Workout>({
  title: '',
  color: '213, 0, 0',
  exercises: [],
  workoutDate: new Date(selectedDate.value.setHours(12, 0, 0, 0)),
})

const { addSet, getExerciseSets, removeSet } = useWorkoutSets(workout, exerciseData)

const isWorkoutSetValid = ref(false)

const workoutSetRules = [
  createValidationRule('required'),
  createValidationRule('numbersOnly'),
]
</script>

<template>
  <div class="workout">
    <div class="workout-data">
      {{ workout }}
      <WorkoutDescription
        @workout-title="workout.title = $event"
        @workout-color="workout.color = $event"
      />

      <!--      <WorkoutExercises -->
      <!--        v-if="selectedExercisesList.length" -->
      <!--        :exercises="selectedExercisesList" -->
      <!--        @toggle-exercise="toggleExercise" -->
      <!--        @remove-exercise="removeExercise" -->
      <!--      /> -->

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
                  :validate-rules="workoutSetRules"
                  @keydown="onlyNumbers($event)"
                  @validation="isWorkoutSetValid = $event"
                />
                <TheInput
                  v-model.number="exerciseData.get(exercise.id).currentRepeats"
                  placeholder="Повторения"
                  :validate-rules="workoutSetRules"
                  @keydown="onlyNumbers($event)"
                  @validation="isWorkoutSetValid = $event"
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

      <p
        v-else
        class="exercises-empty"
      >
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
