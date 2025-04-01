<script setup lang="ts" generic="T">
const uniqueId = useId()

const modelValue = defineModel<T>()
</script>

<template>
  <select
    :id="uniqueId"
    :value="modelValue"
    @change="modelValue = ($event.target as HTMLSelectElement).value as T"
  >
    <button>
      <selectedcontent />
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="m7 10l5 5l5-5z" />
      </svg>
    </button>
    <slot name="options" />
  </select>
</template>

<style scoped>
select {
  background: none;
  padding: 0;

  &, &::picker(select) {
    appearance: base-select;
  }

  &::picker-icon {
    display: none;
  }

  &:not(:open)::picker(select) {
    opacity: 0;
    transform: scale(.95);
  }

  &:open::picker(select) {
    opacity: 1;
    transform: scale(1);
  }

  &:open > button svg {
    transform: rotate(.5turn);
  }

  /* reset some picker styles */
  &::picker(select) {
    background: lightgray;
    border-radius: 4px;
    padding: 0;
    margin-block: 5px;

    @media (forced-colors: none) {
      border: none;
    }
  }
}

selectedcontent > * {
  transition:
    transform 1s ease,
    display 1s allow-discrete,
    opacity 1s;

  @starting-style {
    opacity: 0;
    transform: translateY(10px);
  }
  opacity: 1;
}
</style>
