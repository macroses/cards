<script setup lang="ts">
import { useModules } from "@/composables/modules/useModules"

interface Module {
  id: string;
  name: string;
}

const { modules, fetchModules, deleteModule } = useModules()

const handleDeleteModule = async (moduleId: string) => {
  if (confirm('Вы уверены, что хотите удалить этот модуль? Все связанные карточки также будут удалены.')) {
    await deleteModule(moduleId)
  }
}

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
        class="flex justify-between items-center mb-2"
      >
        <NuxtLink :to="`/module/${(module as Module).id}`">
          {{ (module as Module).name }}
        </NuxtLink>
        <Button @click="handleDeleteModule((module as Module).id)" variant="destructive" size="sm">
          Удалить
        </Button>
      </li>
    </ul>
  </div>
</template>
