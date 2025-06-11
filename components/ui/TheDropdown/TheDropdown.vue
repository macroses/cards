<script setup lang="ts" generic="T">
const props = defineProps<{
  valueClass?: string | number | null
  isValueVisible?: boolean
  noIcon?: boolean
}>()

const dropdown = useTemplateRef<HTMLDivElement>('dropdown')
const isOpen = shallowRef(false)

const modelValue = defineModel<T>()

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectValue(value: T) {
  modelValue.value = value
  isOpen.value = false
}

onClickOutside(dropdown, () => {
  isOpen.value = false
})

defineExpose({ selectValue })
</script>

<template>
  <div
    ref="dropdown"
    class="dropdown"
  >
    <div
      class="dropdown__selected-value"
      :class="{
        opened: isOpen,
        [`dropdown__selected-value--${modelValue}`]: modelValue,
      }"
      @click="toggleDropdown"
    >
      <TheIcon
        v-if="!props.noIcon"
        icon-name="angle-down"
        width="14"
      />
      {{ modelValue }}
    </div>
    <div
      v-auto-animate="{ duration: 300 }"
      class="dropdown__parent-wr"
    >
      <ul
        v-if="isOpen"
        class="dropdown__values-list"
      >
        <slot :select-value="selectValue" />
      </ul>
    </div>
  </div>
</template>

<style scoped src="./style.css" />
