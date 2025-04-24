<script setup lang="ts">
import type { ExerciseItemProps } from '~/ts/componentProps'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

defineProps<ExerciseItemProps>()

const emit = defineEmits<{
  select: [exercise: ExerciseServerTemplate]
  openModal: [exercise: ExerciseServerTemplate]
}>()
</script>

<template>
  <li
    class="exercise-item"
    :class="{ added: isSelected }"
    :style="{ viewTransitionName: isSelected ? '' : `exercise-${exercise.id}` }"
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
