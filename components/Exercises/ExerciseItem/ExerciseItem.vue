<script setup lang="ts">
import type { ExerciseItemProps } from '~/ts/componentProps'

defineProps<ExerciseItemProps>()

const emit = defineEmits<{
  select: [exercise]
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
