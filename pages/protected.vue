<script setup lang="ts">
definePageMeta({ auth: true})

const { data: authData } = useAuth()
const userTexts = ref([])

const { data: fetchedUserTexts, error } = await useFetch('/api/user-text', {
  query: { userId: authData.value?.user?.id },
  key: authData?.value?.user?.id
})

watchEffect(() => {
  if (fetchedUserTexts.value) {
    userTexts.value = fetchedUserTexts.value
  }
})

if (error.value) {
  console.error('Ошибка при загрузке текстов:', error.value)
}
</script>

<template>
  <h1 class="text-3xl font-bold">Защищенная страница</h1>
  <div v-if="userTexts.length > 0">
    <h2 class="text-2xl mt-4">Ваши сохраненные тексты:</h2>
    <ul>
      <li v-for="text in userTexts" :key="text.id">
        {{ text.text }}
      </li>
    </ul>
  </div>
  <p v-else class="mt-4">У вас пока нет сохраненных текстов.</p>
</template>