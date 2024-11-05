<script setup lang="ts">
const emit = defineEmits<{
  (event: 'workoutTitle', title: string): void
  (event: 'workoutColor', color: string): void
}>()

const isWorkoutNameValid = ref(false)
const workoutTitle = ref()

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
    </div>
  </div>
</template>
