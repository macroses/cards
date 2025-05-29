<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  selectedDate: Date
  title?: string
  color?: string
}>()

const emit = defineEmits<{
  (event: 'workoutTitle', title: string): void
  (event: 'workoutColor', color: string): void
  (event: 'toggleCalendar'): void
  (event: 'isTitleValid', isValid: boolean): void
}>()

const { defineField, errors, values, meta } = useForm({
  validationSchema: toTypedSchema(z.object({
    workoutTitle: z.string()
      .max(50, 'Максимум 50 символов')
      .min(3, 'Минимум 3 символа'),
  })),
})

const [workoutTitle] = defineField('workoutTitle')

watch(() => props.title, (newTitle?: string) => {
  if (newTitle) {
    workoutTitle.value = newTitle
  }
}, { immediate: true })

function changeWorkoutTitle(): void {
  emit('workoutTitle', values.workoutTitle || '')
}

function changeWorkoutColor(color: string): void {
  emit('workoutColor', color)
}

watch(workoutTitle, () => {
  emit('workoutTitle', values.workoutTitle || '')
  emit('isTitleValid', meta.value.valid)
})
</script>

<template>
  <div class="workout__description">
    <div class="workout__name">
      <TheInput
        v-model="workoutTitle"
        placeholder="Workout name"
        close-button
        :error-message="errors.workoutTitle"
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
