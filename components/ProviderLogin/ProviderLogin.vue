<script setup lang="ts">
defineProps({
  providerName: String,
})
const { signIn } = useAuth()
</script>

<template>
  <TheButton
    variant="outline"
    @click="signIn(providerName?.toLocaleLowerCase())"
  >
    {{ providerName }}
  </TheButton>
</template>
