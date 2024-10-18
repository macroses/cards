<script setup lang="ts">
import type { Module } from '~/types/Module'

defineProps<{
  moduleName?: string
  module?: Module
}>()

const { t } = useI18n()
</script>

<template>
  <div class="card-container__header">
    <TheButton
      variant="ghost"
      @click="navigateTo('/modules')"
    >
      <TheIcon
        icon-name="angle-left"
        width="18px"
      />
      {{ t('back') }}
    </TheButton>

    <h1>{{ moduleName || module?.name }}</h1>
  </div>
</template>
