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
}>()

const editedName = ref(props.module.name)
const editedDescription = ref(props.module.description || '')

function handleSave() {
  if (editedName.value !== props.module.name || editedDescription.value !== props.module.description) {
    emit('save', editedName.value, editedDescription.value)

    return
  }

  emit('cancel')
}
</script>

<template>
  <li>
    <template v-if="isEditing">
      <TheInput v-model="editedName" placeholder="Название модуля" />
      <TheInput v-model="editedDescription" placeholder="Описание модуля" />
      <div class="card-actions__save">
        <TheButton
          variant="outline"
          @click="$emit('cancel')"
        >
          Отмена
        </TheButton>
        <TheButton
          @click="handleSave"
        >
          Сохранить
        </TheButton>
      </div>
    </template>
    <template v-else>
      <slot name="title" />
      <slot name="description" />
      <slot name="footer" />
      <div class="card-actions__edit">
        <TheButton
          variant="ghost"
          icon-only
          @click="$emit('edit')"
        >
          <Icon
            name="codicon:edit"
            size="1rem"
          />
        </TheButton>
        <TheButton
          variant="ghost"
          icon-only
          @click="$emit('delete')"
        >
          <Icon
            name="codicon:trash"
            size="1rem"
          />
        </TheButton>
      </div>
    </template>
  </li>
</template>

<style scoped src="./style.css" />
