<script setup lang="ts">
defineProps({
  providerName: String,
})
const { signIn } = useAuth()
</script>

<template>
  <TheButton
    variant="outline"
    :aria-label="`Sign in with ${providerName}`"
    @click="signIn(providerName?.toLocaleLowerCase())"
  >
    {{ providerName }}
  </TheButton>
</template>
