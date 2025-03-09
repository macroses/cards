<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  defaultChecked: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])

const uniqueId = useId()
const defaultChecked = ref(props.defaultChecked)
const isChecked = computed(() => {
  if (defaultChecked.value) {
    return true
  }

  else if (props.value === props.modelValue) {
    return true
  }

  return false
})

watch(
  () => props.modelValue,
  () => {
    if (isChecked.value) {
      defaultChecked.value = false
    }
  },
)
</script>

<template>
  <div class="radio-parent">
    <div class="radio-content">
      <div class="radio">
        <input
          :id="uniqueId"
          class="radio-component"
          type="radio"
          :value="value"
          :checked="defaultChecked || isChecked"
          @change="$emit('update:modelValue', $event.target.value)"
        >
        <span
          class="radio-effect"
          :class="{ active: defaultChecked || isChecked }"
        />
      </div>

      <label
        :for="uniqueId"
        class="radio-label"
      >{{ label }}</label>
    </div>
  </div>
</template>

<style src="./style.css"></style>
