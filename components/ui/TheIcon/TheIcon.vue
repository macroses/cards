<script setup lang="ts">
import type { IconProps } from '~/ts/componentProps'

defineProps<IconProps>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="`${width}px`"
  >
    <use :xlink:href="`/icons/light.svg#${iconName}`" />
  </svg>
</template>

<style>
svg {
  height: auto;
  fill: currentColor
}
</style>
