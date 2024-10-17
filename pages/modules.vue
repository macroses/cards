<script setup lang="ts">
import TheDialog from '@/components/ui/TheDialog/TheDialog.vue'

const {
  modules,
  fetchModules,
  deleteModule,
  updateModule,
} = useModules()

const { t } = useI18n()
const moduleNameState = useState<string>('moduleName', () => '')

const editingModuleId = ref<string | null>(null)
const dialogModuleCreator = ref<InstanceType<typeof TheDialog> | null>(null)

const handleDeleteModule = async (moduleId: string) => {
  await deleteModule(moduleId)
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
        <h1>{{ t('yourFolders') }}</h1>
        <TheButton @click="openDialogModule">
          <TheIcon
            fill="white"
            icon-name="plus"
            width="18px"
          />
          {{ t('create') }}
        </TheButton>
      </div>
      <ul
        v-if="modules.length"
        class="modules-list"
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
          @click="toModule(module.id, module.name)"
        >
          <template #title>
            <h2>{{ module.name }}</h2>
          </template>
          <template #description>
            {{ module.description }}
          </template>
          <template #footer>
            <div class="card__footer">
              <Badge>{{ module.cardCount }} карточек</Badge>
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
        <TheIcon
          icon-name="plus"
          width="18px"
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
