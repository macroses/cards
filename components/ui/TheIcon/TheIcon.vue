<script setup lang="ts">
interface IconProps {
  width?: string
  iconName: string
  fill?: string
}

defineProps<IconProps>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="width"
    style="
      fill: currentColor;
      height: auto;
    "
  >
    <use :xlink:href="`/icons/light.svg#${iconName}`" />
  </svg>
</template>
