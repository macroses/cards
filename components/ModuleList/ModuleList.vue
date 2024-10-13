<script setup lang="ts">
import { ref } from 'vue'

interface Module {
  id: string
  name: string
  description: string
}

const {
  modules,
  fetchModules,
  deleteModule,
  updateModule
} = useModules()

const editingModuleId = ref<string | null>(null)
const editedModuleName = ref('')

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

const cancelEdit = () => editingModuleId.value = null

onMounted(fetchModules)
defineExpose({ fetchModules })
</script>

<template>
  <div>
    <ul class="modules-list" v-if="modules.length">
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
    <div
      v-else
      class="empty-state"
    >
      <span>No folders yet</span>
      <TheButton>Create folder</TheButton>
    </div>
  </div>
</template>

<style>
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
</style>