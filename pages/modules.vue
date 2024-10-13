<script setup lang="ts">
import { type Module } from "~/types/Module"
import TheDialog from '@/components/ui/TheDialog/TheDialog.vue'

const {
  modules,
  fetchModules,
  deleteModule,
  updateModule
} = useModules()

const editingModuleId = ref<string | null>(null)
const editedModuleName = ref('')
const dialogModuleCreator = ref<InstanceType<typeof TheDialog> | null>(null)

const handleDeleteModule = async (moduleId: string) => {
  if (confirm('Are you sure you want to delete this module? All cards will be lost.')) {
    await deleteModule(moduleId)
  }
}

const startEditing = (module: Module) => {
  editingModuleId.value = module.id
  editedModuleName.value = module.name
}

const saveEdit = async (moduleId: string) => {
  if (editedModuleName.value.trim()) {
    await updateModule(moduleId, editedModuleName.value)
    editingModuleId.value = null
  }
}

const openDialogModule = () => {
  dialogModuleCreator.value?.openDialog()
}

const cancelEdit = () => editingModuleId.value = null

const refreshModules = () => {
  fetchModules()
  dialogModuleCreator.value?.closeDialog()
}

onMounted(fetchModules)
defineExpose({ fetchModules })
</script>

<template>
  <div>
    <div v-if="modules.length">
      <div class="header">
        <h1>Ваши папки</h1>
        <TheButton @click="openDialogModule">
          Создать папку
        </TheButton>
      </div>
      <ul
        class="modules-list"
        v-if="modules.length"
      >
      <li
        v-for="module in modules" 
        :key="module.id"
        class="modules-list__item"
      >
        <template v-if="editingModuleId === module.id">
          <input v-model="editedModuleName" @keyup.enter="saveEdit(module.id)" />
          <div>
            <button
              @click="saveEdit(module.id)"
            >
              save
            </button>
            <button
              @click="cancelEdit"
            >
              close
            </button>
          </div>
        </template>
        <template v-else>
          <NuxtLink :to="`/module/${module.id}`">
            {{ module.name }}
          </NuxtLink>
          <p>{{ module.description }}</p>
          <p>Количество карточек: {{ module.cardCount }}</p>
          <div>
            <button
              @click="startEditing(module)"
            >
             edit
            </button>
            <button
              @click="handleDeleteModule(module.id)"
            >
              delete
            </button>
            </div>
          </template>
        </li>
      </ul>
    </div>
    
    <div
      v-else
      class="empty-state"
    >
      <span>No folders yet</span>
      <TheButton @click="openDialogModule">Create folder</TheButton>
    </div>

    <TheDialog ref="dialogModuleCreator">
      <template #content>
        <ModuleCreator @module-created="refreshModules" />
      </template>
    </TheDialog>
  </div>
</template>

<style scoped>
.modules-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 4px;
}

.modules-list__item {
  border: 1px solid;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100svh;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>