<script setup lang="ts">
const props = defineProps({
  providerName: String
})
const { signIn } = useAuth()

const logoIcon = computed(() => {
  return props.providerName === 'GitHub' ? 'logos:github-icon' : 'logos:google-icon'
})
</script>

<template>
  <Button
    variant="outline"
    @click="signIn(providerName?.toLocaleLowerCase())"
  >
    <Icon
      :name="logoIcon"
      class="w-4 h-4 mr-2"
    />
    {{ providerName }}
  </Button>
</template>
