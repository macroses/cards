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
const textareaRef = ref<HTMLTextAreaElement | null>(null)

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

function adjustHeight() {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.addEventListener('input', adjustHeight)
    adjustHeight()
  }
})

watch(textareaValue, (newValue) => {
  emit('update:modelValue', newValue)
  validate()
  adjustHeight()
})
</script>

<template>
  <div class="textarea-wrapper">
    <textarea
      :id="uniqueId"
      ref="textareaRef"
      v-model="textareaValue"
      class="textarea"
      :placeholder="placeholder"
      :class="{ 'input--error': error }"
    />
  </div>
</template>

<style src='./style.css' />
