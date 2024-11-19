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
  <div class="date-menu">
    <div class="date-menu__event-name">
      {{ workoutTitle }}
    </div>

    <ul class="date-menu__functions">
      <li class="date-menu__functions-item">
        <TheButton
          variant="ghost"
          icon-only
          @click.stop="emit('copyWorkout')"
        >
          <TheIcon
            icon-name="copy"
            width="20px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          variant="ghost"
          icon-only
          @click="emit('updateWorkout')"
        >
          <TheIcon
            icon-name="pen-to-square"
            width="20px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          variant="ghost"
          icon-only
          @click.stop="emit('deleteWorkout')"
        >
          <TheIcon
            icon-name="trash-can"
            width="20px"
          />
        </TheButton>
      </li>
    </ul>
  </div>
</template>

<style src="./style.css" />
