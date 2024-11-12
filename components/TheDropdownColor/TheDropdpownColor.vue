<script setup lang="ts">
import { WORKOUT_COLORS } from '~/constants/workout'
import type { WorkoutColor } from '~/ts/types/workoutColor.type'

const emit = defineEmits<{
  dropColor: [color: WorkoutColor]
}>()

const container = ref<HTMLElement | null>(null)

const defaultColor = ref(WORKOUT_COLORS[0].rgb)
const isDropDownActive = ref(false)

function dropColor(color: string) {
  isDropDownActive.value = false
  defaultColor.value = color
  emit('dropColor', color)
}

onClickOutside(container, () => (isDropDownActive.value = false))
</script>

<template>
  <div
    ref="container"
    class="dropdown-color__container"
    @click="isDropDownActive = !isDropDownActive"
  >
    <div class="title">
      Label
    </div>
    <div
      class="dropdown-color__result"
      :style="{ backgroundColor: `rgb(${defaultColor})` }"
    />
    <TheIcon
      class="dropdown-color__arrow"
      icon-name="angle-down"
      width="11px"
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
