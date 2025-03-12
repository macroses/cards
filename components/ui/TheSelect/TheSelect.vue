<script setup lang="ts">
import { watchImmediate } from '@vueuse/core'

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

const idModel = defineModel<number>('id')
const valueModel = defineModel<string>('value')

const dropdownParent = ref(null)
const isDropdownOpened = ref(false)
const toggleDropdown = () => (isDropdownOpened.value = !isDropdownOpened.value)

function activeValue(option: Option) {
  idModel.value = option.id
  valueModel.value = option.value
  isDropdownOpened.value = false
}

watchImmediate(() => props.dropdownList, (newList) => {
  if (newList.length && !idModel.value && !valueModel.value) {
    const firstOption = newList[0]

    idModel.value = firstOption.id
    valueModel.value = firstOption.value
  }
})

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
      {{ valueModel || defaultValue }}
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
          :class="{ activeItem: idModel === item.id }"
          @click="activeValue(item)"
        >
          {{ item.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style src="./style.css" />
