<script lang="ts" setup>
import type { Card } from '~/types/Card'
import { createValidationRule } from '~/utils/validationRules'

const props = defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'update', updatedCard: Partial<Card>): void
}>()

const editingCard = ref(false)
const editedCard = ref({ ...props.card })

const questionRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 100),
]

const answerRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 200),
]

function startEditing() {
  editingCard.value = true
}

function cancelEditing() {
  editingCard.value = false
  editedCard.value = { ...props.card }
}

function saveEdit() {
  emit('update', editedCard.value)
  editingCard.value = false
}

const inputFields: { model: 'question' | 'answer', placeholder: string, rules: any[] }[] = [
  { model: 'question', placeholder: 'Вопрос', rules: questionRules },
  { model: 'answer', placeholder: 'Ответ', rules: answerRules },
]
</script>

<template>
  <li>
    <template v-if="editingCard">
      <div v-for="field in inputFields" :key="field.model">
        <TheInput
          v-model="editedCard[field.model]"
          :placeholder="field.placeholder"
          :validate-rules="field.rules"
        />
      </div>
      <TheButton
        variant="ghost"
        icon-only
        @click="saveEdit"
      >
        <TheIcon
          icon-name="floppy-disk"
          width="18px"
        />
      </TheButton>
      <TheButton
        variant="ghost"
        icon-only
        @click="cancelEditing"
      >
        <TheIcon
          icon-name="xmark"
          width="18px"
        />
      </TheButton>
    </template>
    <template v-else>
      <div class="card-item__edit">
        <TheButton
          variant="ghost"
          icon-only
          @click="startEditing"
        >
          <TheIcon
            icon-name="pen-to-square"
            width="18px"
          />
        </TheButton>
        <TheButton
          variant="ghost"
          icon-only
          @click="$emit('delete')"
        >
          <TheIcon
            icon-name="xmark"
            width="18px"
          />
        </TheButton>
      </div>
      <div class="card-item__block">
        <div class="card-item__side left">
          {{ props.card.question }}
        </div>
        <div class="card-item__side right">
          {{ props.card.answer }}
        </div>
      </div>
    </template>
  </li>
</template>

<style scoped src="./style.css" />
