<script setup lang="ts">
import { useModules } from "@/composables/modules/useModules"

interface Module {
  id: string;
  name: string;
}

const { modules, fetchModules } = useModules()

onMounted(fetchModules)
defineExpose({ fetchModules })
</script>

<template>
  <div>
    <h1>Ваши папки</h1>
    <ul>
      <li
        v-for="module in modules" 
        :key="module.id" 
      >
        <NuxtLink :to="`/module/${(module as Module).id}`">
          {{ (module as Module).name }}
        </NuxtLink>
    </li>
    </ul>
  </div>
</template>
