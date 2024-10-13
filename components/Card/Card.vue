<script setup lang="ts">
import { type Module } from "~/types/Module"

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

const handleSave = () => {
  emit('save', editedName.value, editedDescription.value)
}
</script>

<template>
  <li>
    <template v-if="isEditing">
      <TheInput v-model="editedName" placeholder="Название модуля" />
      <TheInput v-model="editedDescription" placeholder="Описание модуля" />
      <div class="card-actions__save">
        <TheButton 
        @click="$emit('cancel')"
         variant="outline"
        >
          Отмена
        </TheButton>
        <TheButton
         @click="handleSave"
         >Сохранить
        </TheButton>
      </div>
    </template>
    <template v-else>
      <slot name="title" />
      <slot name="description" />
      <slot name="footer" />
      <div class="card-actions__edit">
        <TheButton 
        @click="$emit('edit')" 
          variant="ghost"
          icon-only
        >
          <Icon name="solar:pen-2-line-duotone" />
        </TheButton>
        <TheButton 
          @click="$emit('delete')"
          variant="ghost"
          icon-only
        >
          <Icon name="solar:trash-bin-trash-line-duotone" />
        </TheButton>
      </div>
    </template>
  </li>
</template>

<style scoped src="./style.css" />