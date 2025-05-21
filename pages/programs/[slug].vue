<script setup lang="ts">
const route = useRoute()

const allowedSlugs = ['linear', 'undulating', 'block']

onMounted(() => {
  if (!allowedSlugs.includes(route.params.slug as string)) {
    showError({
      statusCode: 404,
      message: 'Страница не найдена',
    })
  }
})
</script>

<template>
  <p>this is {{ route.params.slug }}</p>
</template>
