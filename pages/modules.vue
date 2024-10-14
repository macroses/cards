<script setup lang="ts">
import TheDialog from '@/components/ui/TheDialog/TheDialog.vue'

const {
  modules,
  fetchModules,
  deleteModule,
  updateModule
} = useModules()

const moduleNameState = useState<string>('moduleName', () => '')

const editingModuleId = ref<string | null>(null)
const dialogModuleCreator = ref<InstanceType<typeof TheDialog> | null>(null)

const handleDeleteModule = async (moduleId: string) => {
  if (confirm('Вы уверены, что хотите удалить этот модуль? Все карточки будут потеряны.')) {
    await deleteModule(moduleId)
  }
}

const startEditing = (moduleId: string) => editingModuleId.value = moduleId

const cancelEdit = () => editingModuleId.value = null

const saveEdit = async (moduleId: string, newName: string, newDescription: string) => {
  await updateModule(moduleId, newName, newDescription)
  editingModuleId.value = null
}

const openDialogModule = () => {
  dialogModuleCreator.value?.openDialog()
}

const refreshModules = () => {
  fetchModules()
  dialogModuleCreator.value?.closeDialog()
}

const toModule = (moduleId: string, moduleName: string) => {
  moduleNameState.value = moduleName
  navigateTo(`/module/${moduleId}`)
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
        <Card
          v-for="module in modules"
          :key="module.id"
          :module="module"
          :is-editing="editingModuleId === module.id"
          @edit="startEditing(module.id)"
          @save="(name, description) => saveEdit(module.id, name, description)"
          @cancel="cancelEdit"
          @delete="handleDeleteModule(module.id)"
        >
          <template #title>
            <h2>{{ module.name }}</h2>
          </template>
          <template #description>{{ module.description }}</template>
          <template #footer>
            <div class="card__footer">
              <Badge>{{ module.cardCount }} карточек</Badge>
              <TheButton
                @click="toModule(module.id, module.name)"
                icon-only
                variant="ghost"
              >
                <Icon
                  name="codicon:debug-continue-small"
                  size="1.2rem"
                />
              </TheButton>
            </div>
          </template>
        </Card>
      </ul>
    </div>
    
    <div
      v-else
      class="empty-state"
    >
      <span>Папок пока нет</span>
      <TheButton @click="openDialogModule">
        <Icon
          name="codicon:add"
          size="1.2rem"
          style="color: white"
        />
        Создать папку
      </TheButton>
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 4px;
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

h2 {
  margin: 0;
  font-size: 16px;
}

.card__footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-state {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>