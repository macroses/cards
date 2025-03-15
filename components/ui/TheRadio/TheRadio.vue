<script setup lang="ts" generic="T">
interface RadioInputProps {
  name: string
  value: string | number | boolean | null | undefined
  label?: string
  disabled?: boolean
  modelValue?: T
}

defineProps<RadioInputProps>()

const id = useId()
const modelValue = defineModel<T>()
</script>

<template>
  <div
    class="radio-input-wrapper"
  >
    <input
      :id="id"
      v-model="modelValue"
      type="radio"
      :checked="modelValue === value"
      :name="name"
      :value="value"
      :disabled="disabled"
      class="radio-input-wrapper__input"
    >
    <label :for="id" class="radio-input-wrapper__label"> {{ label }} </label>
  </div>
</template>

<style src="./style.css"></style>
