<script setup lang="ts" generic="T">
import type { RadioInputProps } from '~/ts/componentProps'

defineProps<RadioInputProps<T>>()

const id = useId()
const modelValue = defineModel<T>()
</script>

<template>
  <label class="radio-input-wrapper">
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
    <span class="radio-input-wrapper__text"> {{ label }} </span>
  </label>
</template>

<style src="./style.css"></style>
