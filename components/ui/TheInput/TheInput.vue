<script setup lang="ts">
import { type InputProps } from "~/components/ui/TheInput/types"

const uniqueId = useId()

withDefaults(defineProps<InputProps>(), {
  disabled: false,
  label: '',
  placeholder: '',
  type: 'text',
  mode: 'text',
  value: ''
})

const modelValue = defineModel<string | number | null>({
  type: [String, Number, null],
  required: true
})
</script>

<template>
  <div class="input-content">
    <label
      v-if="label"
      :for="uniqueId"
      class="input-label"
    >
      {{ label }}
    </label>
    <input
      class="input"
      :inputmode="mode"
      :id="uniqueId"
      :type="type"
      v-model="modelValue"
      :placeholder="placeholder"
    />
  </div>
</template>

<style src="./style.css" />