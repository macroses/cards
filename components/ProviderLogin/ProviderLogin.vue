<script setup lang="ts">
const props = defineProps({
  providerName: String,
})
const { signIn } = useAuth()

const logoIcon = computed(() => {
  return props.providerName === 'GitHub' ? 'logos:github-icon' : 'logos:google-icon'
})
</script>

<template>
  <TheButton
    variant="outline"
    @click="signIn(providerName?.toLocaleLowerCase())"
  >
    <Icon :name="logoIcon" />
    {{ providerName }}
  </TheButton>
</template>
