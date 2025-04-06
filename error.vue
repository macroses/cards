<script setup lang="ts">
import type { NuxtError } from '#app'
import { PAGES } from '~/constants'

defineProps({
  error: Object as () => NuxtError,
})

const localePath = useLocalePath()

function handleError() {
  clearError()
  navigateTo(localePath(PAGES.HOME))
}
</script>

<template>
  <div class="error-page">
    <h1>{{ error?.statusCode }}</h1>
    <p>{{ error?.message }}</p>
    <TheButton @click="handleError">
      {{ $t('back') }}
    </TheButton>
  </div>
</template>
