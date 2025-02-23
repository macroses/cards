<script setup lang="ts">
import type InputTextProps from '~/ts/componentProps/InputText.prop'

const props = withDefaults(defineProps<InputTextProps>(), {
  type: 'text',
  inputmode: 'text',
  placeholder: '',
  noClear: false,
  autocomplete: 'off',
  validateRules: () => ([]),
})

const emit = defineEmits(['validation', 'blur'])
const input = ref<HTMLInputElement | null>(null)

const uniqueId = useId() as string
const modelValue = defineModel<string | number | undefined | null>({ default: '' })
const error = ref('')

defineExpose({
  focus: () => input.value?.focus(),
})

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

function onBlur() {
  emit('blur')
  validate()
}

function handleClear(e: Event) {
  e.preventDefault()
  modelValue.value = ''
}

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.value.length > props.max) {
    input.value = input.value.slice(0, props.max)
    modelValue.value = input.value
  }
}

watch(modelValue, () => validate())
</script>

<template>
  <label class="input-wrapper">
    <input
      :id="uniqueId"
      ref="input"
      v-model="modelValue"
      :placeholder="placeholder"
      class="input"
      :type
      :inputmode
      :autocomplete
      :class="{ 'input--error': error }"
      @input="handleInput"
      @blur="onBlur"
    >
    <button
      v-if="modelValue && !noClear"
      class="close-button"
      type="button"
      @mousedown.prevent="handleClear"
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
