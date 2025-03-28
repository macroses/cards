<script setup lang="ts">
import { watchImmediate } from '@vueuse/core'

const props = defineProps<{
  selectedDate: Date
  title?: string
  color?: string
}>()

const emit = defineEmits<{
  (event: 'workoutTitle', title: string): void
  (event: 'workoutColor', color: string): void
  (event: 'toggleCalendar'): void
}>()

const workoutTitle = ref('')

watchImmediate(() => props.title, (newTitle?: string) => {
  if (newTitle) {
    workoutTitle.value = newTitle
  }
})

const isWorkoutNameValid = ref(false)

const workoutNameRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 50),
]

function changeWorkoutTitle(): void {
  emit('workoutTitle', workoutTitle.value)
}

function changeWorkoutColor(color: string): void {
  emit('workoutColor', color)
}

watch(workoutTitle, (newValue: string) => {
  emit('workoutTitle', newValue || '')
})
</script>

<template>
  <div class="workout__description">
    <div class="workout__name">
      <TheInput
        v-model="workoutTitle"
        placeholder="Workout name"
        :validate-rules="workoutNameRules"
        :max="50"
        close-button
        @validation="isWorkoutNameValid = $event"
        @input="changeWorkoutTitle"
      />
      <TheDropdpownColor
        :initial-color="color"
        @drop-color="changeWorkoutColor"
      />
      <TheButton
        v-tooltip="{ content: $t('workout.change_date'), position: 'bottom' }"
        variant="secondary"
        @click="$emit('toggleCalendar')"
      >
        {{ formattedDate(selectedDate) }}
      </TheButton>
    </div>
  </div>
</template>
