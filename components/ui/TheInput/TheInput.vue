<script setup lang="ts" generic="T extends string | number | null | undefined">
import type InputTextProps from '~/ts/componentProps/InputText.prop'

const {
  type = 'text',
  inputmode = 'text',
  placeholder = '',
  noClear = false,
  autocomplete = 'off',
  max,
  validateRules = [],
} = defineProps<InputTextProps>()

const emit = defineEmits(['validation', 'blur', 'update:modelValue'])

const input = useTemplateRef<HTMLInputElement | null>('input')

const uniqueId = useId() as string
const modelValue = defineModel<T>()
const error = shallowRef('')

defineExpose({
  focus: () => {
    input.value?.focus()
    input.value?.select()
  },
})

function validate() {
  for (const rule of validateRules) {
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

function handleClear(event: Event) {
  event.preventDefault()
  modelValue.value = null as T
}

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement

  if (max && input.value.length > max) {
    input.value = input.value.slice(0, max)
    modelValue.value = input.value as T
  }
}

function onFocus() {
  input.value?.select()
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
      @focus="onFocus"
    >
    <button
      v-if="modelValue && !noClear"
      class="close-button"
      type="button"
      @mousedown.prevent="handleClear"
    >
      <TheIcon
        icon-name="xmark"
        width="16"
      />
    </button>
    <span v-if="error" class="input__error-message">
      {{ error }}
    </span>
  </label>
</template>

<style src="./style.css" />
