<script setup lang="ts" generic="T">
defineProps({
  value: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})

const uniqueId = useId()

const checked = defineModel<T>('checked')
</script>

<template>
  <div class="checkbox-parent">
    <div class="checkbox-content">
      <div class="checkbox">
        <input
          :id="uniqueId"
          v-model="checked"
          class="checkbox-component"
          type="checkbox"
        >
        <div
          class="checkbox-effect"
          :class="{ active: checked }"
        >
          <div class="checkbox-icon">
            <div class="line1" />
            <div class="line2" />
          </div>
        </div>
      </div>

      <label
        v-if="label"
        :for="uniqueId"
        class="checkbox-label"
      >
        {{ label }}
      </label>
    </div>
  </div>
</template>

<style src="./style.css"></style>
