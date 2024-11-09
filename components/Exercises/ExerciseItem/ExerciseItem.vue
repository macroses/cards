<script setup lang="ts">
import type { Exercise } from '~/types/Exercise'

interface Props {
  exercise: Exercise
  isSelected: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  select: [exercise: Exercise]
  openModal: [exercise: Exercise]
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
