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
  <div>
    <template v-if="editingCard">
      <div v-for="field in inputFields" :key="field.model">
        <TheInput
          v-model="editedCard[field.model]"
          :placeholder="field.placeholder"
          :validate-rules="field.rules"
        />
      </div>
      <button @click="saveEdit">
        Сохранить
      </button>
      <button @click="cancelEditing">
        Отмена
      </button>
    </template>
    <template v-else>
      <button @click="$emit('delete')">
        Удалить
      </button>
      <button @click="startEditing">
        Редактировать
      </button>
      <p><strong>Вопрос:</strong> {{ card.question }}</p>
      <p><strong>Ответ:</strong> {{ card.answer }}</p>
    </template>
  </div>
</template>
