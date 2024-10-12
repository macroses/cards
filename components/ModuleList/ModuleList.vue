<script setup lang="ts">
import { useModules } from "@/composables/modules/useModules"
import { ref } from 'vue'

interface Module {
  id: string;
  name: string;
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

const cancelEdit = () => {
  editingModuleId.value = null
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
        <template v-if="editingModuleId === module.id">
          <Input v-model="editedModuleName" @keyup.enter="saveEdit(module.id)" />
          <div>
            <Button @click="saveEdit(module.id)" variant="outline" size="sm" class="mr-2">
              Сохранить
            </Button>
            <Button @click="cancelEdit" variant="outline" size="sm">
              Отмена
            </Button>
          </div>
        </template>
        <template v-else>
          <NuxtLink :to="`/module/${module.id}`">
            {{ module.name }}
          </NuxtLink>
          <div>
            <Button @click="startEditing(module as Module)" variant="outline" size="sm" class="mr-2">
              Редактировать
            </Button>
            <Button @click="handleDeleteModule((module as Module).id)" variant="destructive" size="sm">
              Удалить
            </Button>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>