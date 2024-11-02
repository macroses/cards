<script setup lang="ts">
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
</script>

<template>
  <div class="workout">
    <div class="workout-data">
      <div class="workout__description">
        {{ formattedDate(selectedDate) }}
        <pre>{{ workout }}</pre>
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
    </div>
    <div class="exercises" />
  </div>
</template>
