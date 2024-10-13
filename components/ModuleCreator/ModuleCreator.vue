<script setup lang="ts">
const { createModule } = useModules()
const emit = defineEmits(['module-created'])

const moduleName = ref('')
const moduleDescription = ref('')

async function handleCreateModule() {
  if (!moduleName.value) {
    return
  }

  const createdModule = await createModule(moduleName.value, moduleDescription.value)

  if (createdModule) {
    emit('module-created')
    moduleName.value = ''
    moduleDescription.value = ''
    navigateTo(`/module/${createdModule.id}`)
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
      <TheInput
        v-model="moduleDescription"
        placeholder="Описание модуля"
      />
      <TheButton type="submit">Создать</TheButton>
    </form>
  </div>
</template>