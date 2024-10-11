<script setup lang="ts">
definePageMeta({ auth: true })

interface ModuleList {
  fetchModules: () => void
}

const moduleListRef = ref<ModuleList | null>(null)

function handleModuleCreated() {
  moduleListRef.value?.fetchModules()
}
</script>

<template>
<div>
    <ModuleCreator @module-created="handleModuleCreated" />
    <ModuleList ref="moduleListRef" />
</div>
</template>