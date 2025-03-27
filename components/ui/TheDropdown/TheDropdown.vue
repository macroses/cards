<script setup lang="ts">
const dropdown = useTemplateRef<HTMLDivElement>('dropdown')
const list = [1, 2, 3, 4, 5]
const modelValue = defineModel<number>()

const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectValue(value: number) {
  modelValue.value = value
  isOpen.value = false
}

onClickOutside(dropdown, () => isOpen.value = false)
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
        [`difficulty-${modelValue}`]: modelValue,
      }"
      @click="toggleDropdown"
    >
      {{ modelValue }}
    </div>
    <Transition>
      <ul
        v-if="isOpen"
        class="dropdown__list"
        :class="{ opened: isOpen }"
      >
        <li
          v-for="item in list"
          :key="item"
          class="dropdown__list-item"
          :class="`difficulty-${item}`"
          @click="selectValue(item)"
        >
          {{ item }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style src="./style.css" />
