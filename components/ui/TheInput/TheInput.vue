<script setup lang="ts">
interface Rule { (value: string): { isValid: boolean, message: string } }

interface Props {
  placeholder?: string
  validateRules?: Rule[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  validateRules: () => [],
})

const emit = defineEmits(['validation'])

const uniqueId = useId()
const modelValue = defineModel<string | undefined>({ default: '' })
const error = ref('')

function validate() {
  for (const rule of props.validateRules) {
    const result = rule(modelValue.value || '')

    if (!result.isValid) {
      error.value = result.message
      emit('validation', false)

      return
    }
  }

  error.value = ''
  emit('validation', true)
}

watch(modelValue, () => validate())
</script>

<template>
  <div class="input-wrapper">
    <input
      :id="uniqueId"
      v-model="modelValue"
      :placeholder="placeholder"
      class="input"
      :class="{ 'input--error': error }"
      @blur="validate"
    >
    <button
      v-if="modelValue"
      class="close-button"
      @click="modelValue = ''"
    >
      <TheIcon
        icon-name="xmark"
        width="20px"
      />
    </button>
    <div v-if="error" class="input__error-message">
      {{ error }}
    </div>
  </div>
</template>

<style src="./style.css" />
