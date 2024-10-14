<script setup lang="ts">
const moduleName = ref('')
const moduleDescription = ref('')
const isModuleNameValid = ref(true)
const isModuleDescriptionValid = ref(true)

const { createModule } = useModules()
const emit = defineEmits(['module-created'])

const moduleNameRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 30)
]

const moduleDescriptionRules = [
  createValidationRule('maxLength', 100)
]

// computed
const isSubmitDisabled = computed(() => !isModuleNameValid.value || !isModuleDescriptionValid.value)

// methods
const handleCreateModule = async () => {
  if (isModuleNameValid.value && isModuleDescriptionValid.value) {
    const createdModule = await createModule(moduleName.value, moduleDescription.value)
    if (createdModule) {
      emit('module-created')
      moduleName.value = ''
      moduleDescription.value = ''
      navigateTo(`/module/${createdModule.id}`)
    }
  }
}
</script>

<template>
  <div class="module-creator">
    <div class="module-creator__title">Создать новый модуль</div>
    <form
      @submit.prevent="handleCreateModule"
      class="module-creator__form"
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