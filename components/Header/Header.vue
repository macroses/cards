<script setup lang="ts">
const { signOut } = useAuth()
const { locale, changeLanguage, initLanguage } = useChangeLanguage()

onMounted(() => {
  initLanguage()
})
</script>

<template>
  <ul>
    <li>
      <TheButton
        :variant="locale === 'en' ? 'outline' : 'ghost'"
        @click="changeLanguage('en')"
      >
        En
      </TheButton>
      <TheButton
        :variant="locale === 'ru' ? 'outline' : 'ghost'"
        @click="changeLanguage('ru')"
      >
        Ru
      </TheButton>
    </li>
    <li>
      <NuxtLink to="/">Home</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/modules">
        Modules
      </NuxtLink>
    </li>
    <li>
      <TheButton
        variant="outline"
        icon-only
        @click="signOut()"
      >
        <Icon name="mage:logout" />
      </TheButton>
    </li>
  </ul>
</template>