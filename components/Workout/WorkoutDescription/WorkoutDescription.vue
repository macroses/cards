<script setup lang="ts">
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

watch(() => props.title, (newTitle) => {
  if (newTitle) {
    workoutTitle.value = newTitle
  }
}, { immediate: true })

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
      <TheDropdpownColor
        :initial-color="color"
        @drop-color="changeWorkoutColor"
      />
      <TheButton
        variant="secondary"
        @click="$emit('toggleCalendar')"
      >
        {{ formattedDate(selectedDate) }}
      </TheButton>
    </div>
  </div>
</template>
