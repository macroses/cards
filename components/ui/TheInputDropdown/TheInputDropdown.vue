<script setup lang="ts" generic="T extends { id: string | number, name: string }">
const props = defineProps<{
  items: T[]
  placeholder: string
}>()

const emit = defineEmits<{
  (event: 'selectItem', item: T): void
}>()

const modelValue = defineModel<string>()

const isSearchInFocus = ref(false)
const searchResults = ref<T[] | null>(null)
const resultList = useTemplateRef<HTMLDivElement>('resultList')

const debouncedSearch = useDebounceFn(() => {
  if (!modelValue.value) {
    searchResults.value = null

    return
  }

  const query = modelValue.value.toLowerCase()

  searchResults.value = props.items.filter(item => item?.name.toLowerCase().includes(query))
}, 100)

function highlightText(text: string) {
  if (!modelValue.value) {
    return text
  }

  const regex = new RegExp(modelValue.value?.toLowerCase(), 'gi')

  return text.replace(regex, '<mark>$&</mark>')
}

const selectedIndex = ref(-1)

function handleKeydown(event: KeyboardEvent) {
  if (!searchResults.value?.length) {
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % searchResults.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = selectedIndex.value <= 0
        ? searchResults.value.length - 1
        : selectedIndex.value - 1
      break
    case 'Enter':
      if (selectedIndex.value >= 0) {
        event.preventDefault()
        emit('selectItem', searchResults.value[selectedIndex.value] as T)
      }
      break
  }
}

function handleBlur() {
  setTimeout(() => {
    isSearchInFocus.value = false
  }, 100)
}

watch(modelValue, debouncedSearch)
watch(searchResults, () => selectedIndex.value = -1)
</script>

<template>
  <div class="input-dropdown">
    <TheInput
      v-model="modelValue"
      :placeholder
      inputmode="search"
      @focus="isSearchInFocus = true"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />
    <ul
      v-if="isSearchInFocus && searchResults"
      ref="resultList"
      class="dropdown-list"
    >
      <li
        v-for="(item, index) in searchResults"
        :key="item?.id"
        class="dropdown-item"
        :class="{ 'dropdown-item--selected': index === selectedIndex }"
        @click="emit('selectItem', item as T)"
      >
        <span v-html="highlightText(item.name)" />
      </li>
    </ul>
  </div>
</template>

<style src="./style.css" />
