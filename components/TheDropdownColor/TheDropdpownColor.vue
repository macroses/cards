<script setup lang="ts">
import type { WorkoutColor } from '~/ts/types/workoutColor.type'
import { watchImmediate } from '@vueuse/core'
import { WORKOUT_COLORS } from '~/constants/workout'

const props = defineProps<{
  initialColor?: string
}>()

const emit = defineEmits<{
  dropColor: [color: WorkoutColor['rgb']]
}>()

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const defaultColor = shallowRef(WORKOUT_COLORS[0].rgb)
const isDropDownActive = shallowRef(false)

// Следим за изменением начального цвета
watchImmediate(() => props.initialColor, (newColor?: string) => {
  if (newColor) {
    defaultColor.value = newColor
  }
})

function dropColor(color: WorkoutColor['rgb']) {
  isDropDownActive.value = false
  defaultColor.value = color
  emit('dropColor', color)
}

onClickOutside(containerRef, () => (isDropDownActive.value = false))
</script>

<template>
  <div
    ref="containerRef"
    class="dropdown-color__container"
    @click="isDropDownActive = !isDropDownActive"
  >
    <div class="title">
      {{ $t('workout.dropdown_color') }}
    </div>
    <div
      class="dropdown-color__result"
      :style="{ backgroundColor: `rgb(${defaultColor})` }"
    />
    <TheIcon
      class="dropdown-color__arrow"
      icon-name="angle-down"
      width="11"
    />
    <ul
      v-if="isDropDownActive"
      class="dropdown-color"
    >
      <li
        v-for="colorItem in WORKOUT_COLORS"
        :key="colorItem.id"
        :style="{ backgroundColor: `rgb(${colorItem.rgb})` }"
        :class="{ active: colorItem.rgb === defaultColor }"
        @click.stop="dropColor(colorItem.rgb)"
      />
    </ul>
  </div>
</template>

<style src="./style.css" />
