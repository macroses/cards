<script setup lang="ts">
interface Rule { (value: string): { isValid: boolean, message: string } }

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
const textareaValue = ref(props.modelValue)
const error = ref('')

function validate() {
  for (const rule of props.validateRules) {
    const result = rule(textareaValue.value)
    if (!result.isValid) {
      error.value = result.message
      emit('validation', false)
      return
    }
  }

  error.value = ''
  emit('validation', true)
}

watch(textareaValue, (newValue) => {
  emit('update:modelValue', newValue)
  validate()
})
</script>

<template>
  <div class="textarea-wrapper">
    <textarea
      :id="uniqueId"
      class="textarea"
      :placeholder="placeholder"
      :class="{ 'input--error': error }"
    />
  </div>
  <div class="textarea-block">
    <!--    <div v-if="error" class="input__error-message"> -->
    <!--      {{ error }} -->
    <!--    </div> -->
  </div>
</template>

<style src='./style.css' />
