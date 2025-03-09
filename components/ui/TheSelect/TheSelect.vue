<script setup lang="ts">
interface Option {
  id: number
  value: string
}

const props = withDefaults(defineProps<{
  dropdownList: Option[]
  isTop?: boolean
  defaultValue?: string
}>(), {
  defaultValue: '',
  isTop: false,
})

const emit = defineEmits(['activeValue'])

const dropdownParent = ref(null)
const isDropdownOpened = ref(false)
const activeItem = ref(props.dropdownList[0])
const toggleDropdown = () => (isDropdownOpened.value = !isDropdownOpened.value)

function activeValue(item: Option) {
  activeItem.value = item
  isDropdownOpened.value = false
  emit('activeValue', item)
}

onClickOutside(dropdownParent, () => (isDropdownOpened.value = false))
</script>

<template>
  <div
    ref="dropdownParent"
    class="dropdown"
  >
    <p
      class="dropdown__value"
      @click="toggleDropdown"
    >
      {{ activeItem.value || defaultValue }}
      <TheIcon
        icon-name="angle-down"
        width="14px"
      />
    </p>
    <div
      class="dropdown__parent"
      :class="{
        'active': isDropdownOpened,
        'dropdown__parent-top': isTop,
      }"
    >
      <ul class="dropdown__list">
        <li
          v-for="item in dropdownList"
          :key="item.id"
          class="dropdown__item"
          :class="{ activeItem: activeItem.id === item.id }"
          @click="activeValue(item)"
        >
          {{ item.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style src="./style.css" />
