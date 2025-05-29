<script setup lang="ts" generic="T extends string | number | null | undefined">
import type InputTextProps from '~/ts/componentProps/InputText.prop'

const {
  type = 'text',
  inputmode = 'text',
  placeholder = '',
  autocomplete = 'off',
  max,
  label,
  ariaLabel,
  ariaRequired = false,
  ariaInvalid,
  errorMessage = '',
} = defineProps<InputTextProps>()

const emit = defineEmits(['validation', 'blur', 'update:modelValue', 'focus'])

const input = useTemplateRef<HTMLInputElement | null>('input')

const uniqueId = useId()
const modelValue = defineModel<T>()

defineExpose({
  focus: () => {
    input.value?.focus()
    input.value?.select()
  },
})

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
</script>

<template>
  <div
    v-auto-animate="{ duration: 100 }"
    class="input-container"
  >
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
        :class="{ 'input-error': errorMessage }"
        :type="type"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        :aria-label="ariaLabel || label"
        :aria-required="ariaRequired"
        :aria-invalid="!!errorMessage || ariaInvalid"
        @input="handleInput"
        @blur="$emit('blur')"
        @focus="onFocus"
      >
    </div>
    <div
      v-if="errorMessage"
      class="input__error-message"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style src="./style.css" />
