<script setup lang="ts">
import type { ButtonProps } from '~/ts/componentProps'

const {
  disabled = false,
  type = 'button',
  variant = 'primary',
  iconOnly = false,
  linkPath = '',
} = defineProps<ButtonProps>()
</script>

<template>
  <button
    v-if="!linkPath"
    :type
    :disabled
    :inert="disabled"
    class="button"
    :class="{
      [`button--${variant}`]: variant,
      'button--icon-only': iconOnly,
    }"
  >
    <span class="button__content"><slot /></span>
  </button>
  <NuxtLink
    v-else
    :to="linkPath"
    class="button"
    :class="{
      [`button--${variant}`]: variant,
      'button--icon-only': iconOnly,
    }"
  >
    <span class="button__content"><slot /></span>
  </NuxtLink>
</template>

<style src="./style.css" />
