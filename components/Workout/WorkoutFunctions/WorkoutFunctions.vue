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

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="date-menu">
    <div class="date-menu__event-name">
      {{ workoutTitle }}
    </div>

    <ul class="date-menu__functions">
      <li>
        <NuxtLink :to="localePath(`/workout/run/${workoutId}`)">
          play
        </NuxtLink>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="t('main_navigation.copy_workout')"
          variant="ghost"
          icon-only
          @click.stop="emit('copyWorkout')"
        >
          <TheIcon
            icon-name="copy"
            width="18px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="t('main_navigation.edit_workout')"
          variant="ghost"
          icon-only
          @click="emit('updateWorkout')"
        >
          <TheIcon
            icon-name="pen-to-square"
            width="18px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="t('main_navigation.delete_workout')"
          variant="ghost"
          icon-only
          @click.stop="emit('deleteWorkout')"
        >
          <TheIcon
            icon-name="trash-can"
            width="18px"
          />
        </TheButton>
      </li>
    </ul>
  </div>
</template>

<style src="./style.css" />
