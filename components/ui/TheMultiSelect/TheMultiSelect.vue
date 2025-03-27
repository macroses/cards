<script setup lang="ts">
interface MultiSelectItem {
  id: number
  value: string
}

const props = defineProps({
  multiselectList: {
    type: Array as PropType<MultiSelectItem[]>,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  isSingleSelect: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  chosenItems: {
    type: Array as PropType<MultiSelectItem[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  removeItems: [item: MultiSelectItem]
  getItems: [item: MultiSelectItem]
}>()

const isDropdownVisible = ref(false)
const multiselectDropdown = useTemplateRef<HTMLDivElement>('multiselectDropdown')

function isItemSelected(item: MultiSelectItem): boolean {
  return props.chosenItems.some(chosen => chosen.id === item.id)
}

function getItems(item: MultiSelectItem) {
  if (props.isSingleSelect) {
    emit('getItems', item)
    isDropdownVisible.value = false
    return
  }

  emit('getItems', item)
}

function removeItem(item: MultiSelectItem) {
  emit('removeItems', item)
}

onClickOutside(multiselectDropdown, () => (isDropdownVisible.value = false))
</script>

<template>
  <div
    :class="{ 'multiselect--disabled': disabled }"
    class="multiselect"
  >
    <div
      class="multiselect__value"
      :class="{ active: isDropdownVisible }"
      @click="isDropdownVisible = !isDropdownVisible"
    >
      <div
        v-if="!chosenItems.length"
        class="multiselect__placeholder"
      >
        <span class="multiselect__placeholder-value">{{ label }}</span>
        <TheIcon
          icon-name="angle-down"
          width="14px"
        />
      </div>
      <div
        v-for="item in chosenItems"
        v-else
        :key="item.id"
        class="multiselect__item"
      >
        {{ item.value }}
        <TheIcon
          v-if="!isSingleSelect"
          icon-name="xmark"
          width="13px"
          @click.stop="removeItem(item)"
        />
      </div>
    </div>
    <div
      ref="multiselectDropdown"
      class="multiselect__list"
      :class="{ active: isDropdownVisible }"
    >
      <ul class="multiselect__dropdown">
        <li
          v-for="item in multiselectList"
          :key="item.id"
          class="multiselect__dropdown-item"
          :class="{ selected: isItemSelected(item) }"
          @click="getItems(item)"
        >
          {{ item.value }}
          <TheIcon
            v-if="isItemSelected(item)"
            icon-name="check"
            width="15px"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped src="./style.css" />
