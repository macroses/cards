<script setup lang="ts">
import { useModules } from "~/composables/useModules"

const { createModule } = useModules()
const emit = defineEmits(['module-created'])

const moduleName = ref('')

async function handleCreateModule() {
  if (!moduleName.value) {
    return
  }

  const createdModule = await createModule(moduleName.value)
  if (createdModule) {
    emit('module-created')
    moduleName.value = ''
  }
}
</script>

<template>
  <div>
    <h2>Создать новый модуль</h2>
    <form
      @submit.prevent="handleCreateModule"
      class="module-creator"
    >
      <TheInput
        v-model="moduleName"
        placeholder="Название модуля"
      />
      <TheButton type="submit">Создать</TheButton>
    </form>
  </div>
</template>

<style scoped src="./style.css" />