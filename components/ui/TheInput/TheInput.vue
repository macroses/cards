<script setup lang="ts">
import type InputTextProps from '~/ts/componentProps/InputText.prop'

const props = withDefaults(defineProps<InputTextProps>(), {
  type: 'text',
  inputmode: 'text',
  placeholder: '',
  noClear: false,
  validateRules: () => ([]),
})

const emit = defineEmits(['validation'])
const input = ref<HTMLInputElement | null>(null)

const uniqueId = useId() as string
const modelValue = defineModel<string | number | undefined | null>({ default: '' })
const error = ref('')

// Экспортируем метод focus
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
      :type="type"
      :inputmode="inputmode"
      autocomplete="off"
      :class="{ 'input--error': error }"
      @blur="validate"
    >
    <button
      v-if="modelValue && !noClear"
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
