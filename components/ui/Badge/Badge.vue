<script setup lang="ts">
interface BadgeProps {
  variant?: 'primary' | 'empty' | 'low' | 'medium' | 'high' | 'highest'
}

withDefaults(defineProps<BadgeProps>(), {
  variant: 'primary',
})
</script>

<template>
  <div
    class="badge"
    :class="{ [`badge--${variant}`]: variant }"
  >
    <slot />
  </div>
</template>

<style src='./style.css' />
