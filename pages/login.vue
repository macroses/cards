<script setup lang="ts">
import type { Provider } from "next-auth/providers/index"

definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { data: providers } = await useFetch<Provider[]>('/api/auth/providers')
</script>

<template>
  <div class="auth">
    <ProviderLogin
      v-for="provider in providers"
      :key="provider.id"
      :provider-name="provider.name"
    />
  </div>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
</style>