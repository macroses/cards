<script setup lang="ts">
defineProps<{
  selectedDate: Date
}>()

const emit = defineEmits<{
  (event: 'workoutTitle', title: string): void
  (event: 'workoutColor', color: string): void
  (event: 'toggleCalendar'): void
}>()

const isWorkoutNameValid = ref(false)
const workoutTitle = ref('')

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

watch(workoutTitle, (newValue) => {
  emit('workoutTitle', newValue || '')
})
</script>

<template>
  <div class="workout__description">
    <div class="workout__name">
      <TheInput
        v-model.trim="workoutTitle"
        placeholder="Workout name"
        :validate-rules="workoutNameRules"
        @input="changeWorkoutTitle"
        @validation="isWorkoutNameValid = $event"
      />
      <TheDropdpownColor @drop-color="changeWorkoutColor" />
      <TheButton
        variant="secondary"
        @click="$emit('toggleCalendar')"
      >
        {{ formattedDate(selectedDate) }}
      </TheButton>
    </div>
  </div>
</template>
