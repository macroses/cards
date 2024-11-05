<script setup lang="ts">
import type Props from './inputTypes'

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  inputmode: 'text',
  placeholder: '',
  validateRules: () => ([]),
})

const emit = defineEmits(['validation'])

const uniqueId = useId()
const modelValue = defineModel<string | number | undefined>({ default: '' })
const error = ref('')

function validate() {
  for (const rule of props.validateRules) {
    const result = rule(modelValue.value?.toString() || '')

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
  <label class="input-wrapper">
    <input
      :id="uniqueId"
      v-model="modelValue"
      :placeholder
      class="input"
      :type
      :inputmode="inputmode"
      autocomplete="off"
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
        width="16px"
      />
    </button>
    <span v-if="error" class="input__error-message">
      {{ error }}
    </span>
  </label>
</template>

<style src="./style.css" />
