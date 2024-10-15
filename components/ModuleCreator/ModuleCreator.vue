<script setup lang="ts">
const emit = defineEmits(['moduleCreated'])
const moduleName = ref('')
const moduleDescription = ref('')
const isModuleNameValid = ref(true)
const isModuleDescriptionValid = ref(true)

const { createModule } = useModules()

const moduleNameRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 30),
]

const moduleDescriptionRules = [
  createValidationRule('maxLength', 100),
]

// computed
const isSubmitDisabled = computed(() => !isModuleNameValid.value || !isModuleDescriptionValid.value)

// methods
async function handleCreateModule() {
  if (isModuleNameValid.value && isModuleDescriptionValid.value) {
    const createdModule = await createModule(moduleName.value, moduleDescription.value)
    if (createdModule) {
      emit('moduleCreated')
      moduleName.value = ''
      moduleDescription.value = ''
      navigateTo(`/module/${createdModule.id}`)
    }
  }
}
</script>

<template>
  <div class="module-creator">
    <div class="module-creator__title">
      Создать новый модуль
    </div>
    <form
      class="module-creator__form"
      @submit.prevent="handleCreateModule"
    >
      <TheInput
        v-model="moduleName"
        placeholder="Название модуля"
        :validate-rules="moduleNameRules"
        @validation="isModuleNameValid = $event"
      />
      <TheInput
        v-model="moduleDescription"
        placeholder="Описание модуля"
        :validate-rules="moduleDescriptionRules"
        @validation="isModuleDescriptionValid = $event"
      />
      <TheButton
        type="submit"
        :disabled="isSubmitDisabled"
      >
        Создать
      </TheButton>
    </form>
  </div>
</template>

<style src="./style.css" />
