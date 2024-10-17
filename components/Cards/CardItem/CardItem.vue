<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Card } from '~/types/Card'
import { createValidationRule } from '~/utils/validationRules'
import 'dayjs/locale/ru'

const props = defineProps<{
  card: Card
}>()
const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'update', updatedCard: Partial<Card>): void
}>()
dayjs.extend(relativeTime)
dayjs.locale('ru')

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

const startEditing = () => {
  editingCard.value = true
}

const cancelEditing = () => {
  editingCard.value = false
  editedCard.value = { ...props.card }
}

const saveEdit = () => {
  emit('update', editedCard.value)
  editingCard.value = false
}

const nextReviewText = computed(() => {
  if (!props.card.nextReviewAt)
    return 'Не повторялась'

  const nextReview = dayjs(props.card.nextReviewAt)
  if (nextReview.isBefore(dayjs())) {
    return 'Готова к повторению'
  }

  return `Следующее повторение: ${nextReview.fromNow()}`
})

const reviewStatus = computed(() => {
  if (!props.card.nextReviewAt)
    return 'new'
  const nextReview = dayjs(props.card.nextReviewAt)
  if (nextReview.isBefore(dayjs()))
    return 'due'
  return 'scheduled'
})

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
      <div v-if="!editingCard" class="card-item__block">
        <div class="card-item__side left">
          {{ card.question }}
        </div>
        <div class="card-item__side right">
          {{ card.answer }}
        </div>
        <div class="card-item__review-info" :class="reviewStatus">
          {{ nextReviewText }}
        </div>
        <div class="card-item__edit">
          <TheButton variant="ghost" icon-only @click.stop="startEditing">
            <TheIcon icon-name="pencil" width="18px" />
          </TheButton>
          <TheButton variant="ghost" icon-only @click.stop="$emit('delete')">
            <TheIcon icon-name="trash" width="18px" />
          </TheButton>
        </div>
      </div>
    </template>
  </li>
</template>

<style scoped src="./style.css" />
