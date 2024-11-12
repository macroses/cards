<script setup lang="ts">
import type { ExerciseItemProps } from '~/ts/componentProps'
import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'

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
    @click="emit('select', exercise)"
  >
    <p>
      {{ exercise.name }}
      <TheIcon
        v-if="isSelected"
        icon-name="circle-check"
        width="16px"
      />
    </p>
    <TheButton
      variant="transparent"
      @click.stop="emit('openModal', exercise)"
    >
      <TheIcon
        icon-name="circle-info"
        width="20px"
      />
    </TheButton>
    <TheIcon
      icon-name="angle-right"
      width="14px"
    />
  </li>
</template>
