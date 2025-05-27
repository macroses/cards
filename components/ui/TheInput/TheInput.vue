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
  label,
  ariaLabel,
  ariaDescribedby,
  ariaRequired = false,
  ariaInvalid,
} = defineProps<InputTextProps>()

const emit = defineEmits(['validation', 'blur', 'update:modelValue', 'focus'])

const input = useTemplateRef<HTMLInputElement | null>('input')

const uniqueId = useId()
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
  emit('focus')
}

watch(modelValue, () => validate())
</script>

<template>
  <div class="input-container">
    <label
      v-if="label"
      :for="uniqueId"
      class="input-label"
    >
      {{ label }}
    </label>
    <div class="input-wrapper">
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
        :aria-label="ariaLabel || label"
        :aria-describedby="error ? `${uniqueId}-error` : ariaDescribedby"
        :aria-required="ariaRequired"
        :aria-invalid="error ? true : ariaInvalid"
        @input="handleInput"
        @blur="onBlur"
        @focus="onFocus"
      >
      <button
        v-if="modelValue && !noClear"
        class="close-button"
        type="button"
        aria-label="Clear input"
        @mousedown.prevent="handleClear"
      >
        <TheIcon
          icon-name="xmark"
          width="16"
        />
      </button>
      <span
        v-if="error"
        :id="`${uniqueId}-error`"
        class="input__error-message"
        role="alert"
      >
        {{ error }}
      </span>
    </div>
  </div>
</template>

<style src="./style.css" />
