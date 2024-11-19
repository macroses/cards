<script setup lang="ts">
import type { WorkoutFunctionsProps } from '~/ts/componentProps'

withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'updateWorkout'): void
}>()
</script>

<template>
  <div
    class="date-menu"
  >
    <div class="date-menu__event-name">
      {{ workoutTitle }}
    </div>

    <TheButton @click.stop="emit('deleteWorkout')">
      Удалить
    </TheButton>
    <TheButton @click.stop="emit('copyWorkout')">
      Копировать
    </TheButton>
    <TheButton @click="emit('updateWorkout')">
      Изменить
    </TheButton>
  </div>
</template>
