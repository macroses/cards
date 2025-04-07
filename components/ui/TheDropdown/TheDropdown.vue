<script setup lang="ts" generic="T">
const props = defineProps<{
  valueClass?: string | number | null
}>()

const dropdown = useTemplateRef<HTMLDivElement>('dropdown')
const isOpen = ref(false)

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

defineExpose({
  selectValue,
})
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
        valueClass: props.valueClass,
      }"
      @click="toggleDropdown"
    >
      {{ modelValue }}
      <TheIcon
        icon-name="angle-down"
        width="14px"
      />
    </div>

    <Transition>
      <div
        v-if="isOpen"
        class="dropdown__parent"
        :class="{ active: isOpen }"
      >
        <div class="dropdown__list">
          <slot :select-value="selectValue" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style src="./style.css" />
