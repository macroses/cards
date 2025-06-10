<script setup lang="ts">
import type { ExerciseTemplate } from '~/ts'
import type { ExerciseItemProps } from '~/ts/componentProps'

defineProps<ExerciseItemProps>()

const emit = defineEmits<{
  select: [exercise: ExerciseTemplate]
  openModal: [exercise: ExerciseTemplate]
}>()
</script>

<template>
  <li
    class="exercise-item"
    :class="{ added: isSelected }"
    :style="{ '--exercise-transition-name': isSelected ? 0 : `exercise-${exercise.id}` }"
    @click="emit('select', exercise)"
  >
    <p>{{ exercise.name }}</p>
    <TheButton
      variant="transparent"
      @click.stop="emit('openModal', exercise)"
    >
      <TheIcon
        icon-name="circle-info"
        width="20"
      />
    </TheButton>
  </li>
</template>

<style scoped>
.exercise-item {
  position: relative;
  contain: layout;
}
</style>
