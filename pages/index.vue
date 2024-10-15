<script setup lang="ts">
definePageMeta({ auth: true })

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('welcome_home') }}</h1>
</template>
