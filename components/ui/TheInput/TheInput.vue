<script setup lang="ts">
import { ref, watch } from 'vue'

interface Rule {
  (value: string): { isValid: boolean, message: string }
}

interface Props {
  modelValue: string
  placeholder?: string
  validateRules?: Rule[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  validateRules: () => [],
})

const emit = defineEmits(['update:modelValue', 'validation'])
const uniqueId = useId()
const inputValue = ref(props.modelValue)
const error = ref('')

function validate() {
  for (const rule of props.validateRules) {
    const result = rule(inputValue.value)
    if (!result.isValid) {
      error.value = result.message
      emit('validation', false)
      return
    }
  }
  error.value = ''
  emit('validation', true)
}

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
  validate()
})
</script>

<template>
  <div class="input-wrapper">
    <input
      :id="uniqueId"
      v-model="inputValue"
      :placeholder="placeholder"
      class="input"
      :class="{ 'input--error': error }"
      @blur="validate"
    >
    <div v-if="error" class="input__error-message">
      {{ error }}
    </div>
  </div>
</template>

<style src="./style.css" />
