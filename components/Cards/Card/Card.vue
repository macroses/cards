<script setup lang="ts">
import type { Module } from '~/types/Module'

const props = defineProps<{
  module: Module
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'save', name: string, description: string): void
  (e: 'cancel'): void
  (e: 'delete'): void
  (e: 'click'): void
}>()

const editedName = ref(props.module.name)
const editedDescription = ref(props.module.description || '')

const isValuesWasChanged = computed(() => {
  return editedName.value !== props.module.name || editedDescription.value !== props.module.description
})

const handleSave = () => {
  if (isValuesWasChanged.value) {
    emit('save', editedName.value, editedDescription.value)

    return
  }

  emit('cancel')
};

const handleCardClick = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.card-actions__edit')) {
    emit('click')
  }
}
</script>

<template>
  <li @click="handleCardClick">
    <template v-if="isEditing">
      <TheInput v-model="editedName" placeholder="Название модуля" />
      <TheInput v-model="editedDescription" placeholder="Описание модуля" />
      <div class="card-actions__save">
        <TheButton
          variant="outline"
          @click.stop="$emit('cancel')"
        >
          Отмена
        </TheButton>
        <TheButton
          @click.stop="handleSave"
        >
          Сохранить
        </TheButton>
      </div>
    </template>
    <template v-else>
      <slot name="title" />
      <div class="card__description">
        <slot name="description" />
      </div>
      <div class="card__footer">
        <slot name="footer" />
      </div>

      <div class="card-actions__edit">
        <TheButton
          variant="ghost"
          icon-only
          @click.stop="$emit('edit')"
        >
          <TheIcon
            icon-name="pen-to-square"
            width="1rem"
          />
        </TheButton>
        <TheButton
          variant="ghost"
          icon-only
          @click.stop="$emit('delete')"
        >
          <TheIcon
            icon-name="trash"
            width="1rem"
          />
        </TheButton>
      </div>
    </template>
  </li>
</template>

<style scoped src="./style.css" />
