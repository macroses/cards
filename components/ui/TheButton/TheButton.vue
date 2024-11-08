<script setup lang="ts">
interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'transparent'
  iconOnly?: boolean
  link?: boolean
  linkPath?: string
}

withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  type: 'button',
  variant: 'primary',
  link: false,
  iconOnly: false,
  linkPath: '',
})
</script>

<template>
  <button
    v-if="!link"
    :type="type"
    :disabled="disabled"
    :inert="disabled"
    class="button"
    :class="{
      [`button--${variant}`]: variant,
      'button--icon-only': iconOnly,
    }"
  >
    <slot />
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
    <slot />
  </NuxtLink>
</template>

<style src="./style.css" />
