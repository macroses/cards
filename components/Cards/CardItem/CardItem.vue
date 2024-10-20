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
  createValidationRule('maxLength', 1000),
]

const answerRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 1000),
]

const isQuestionValid = ref(true)
const isAnswerValid = ref(true)

function startEditing() {
  editingCard.value = true
}

function cancelEditing() {
  editingCard.value = false
  editedCard.value = { ...props.card }
}

function saveEdit() {
  if (isQuestionValid.value && isAnswerValid.value) {
    emit('update', editedCard.value)
    editingCard.value = false
  }
}

function trimAndNormalizeSpaces(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

function updateContent(field: 'question' | 'answer', event: Event) {
  const target = event.target as HTMLDivElement
  editedCard.value[field] = trimAndNormalizeSpaces(target.innerHTML)
  validate(field)
}

function validate(field: 'question' | 'answer') {
  const rules = field === 'question' ? questionRules : answerRules
  const value = editedCard.value[field]

  for (const rule of rules) {
    const result = rule(value)
    if (!result.isValid) {
      if (field === 'question') {
        isQuestionValid.value = false
      }
      else {
        isAnswerValid.value = false
      }
      return
    }
  }

  if (field === 'question') {
    isQuestionValid.value = true
  }
  else {
    isAnswerValid.value = true
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey) {
    if (event.key === 'b') {
      event.preventDefault()
      document.execCommand('bold', false)
    }
    else if (event.key === 'i') {
      event.preventDefault()
      document.execCommand('italic', false)
    }
    else if (event.key === 'u') {
      event.preventDefault()
      document.execCommand('underline', false)
    }
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain')
  if (text) {
    document.execCommand('insertText', false, text)
  }
}

const nextReviewText = computed(() => {
  if (!props.card.nextReviewAt)
    return 'New'

  const nextReview = dayjs(props.card.nextReviewAt)

  if (nextReview.isBefore(dayjs())) {
    return 'Готова к повторению'
  }

  return `${nextReview.fromNow()}`
})

const reviewStatus = computed(() => {
  if (!props.card.nextReviewAt) {
    return 'new'
  }

  const nextReview = dayjs(props.card.nextReviewAt)

  if (nextReview.isBefore(dayjs())) {
    return 'due'
  }

  return 'scheduled'
})

const inputFields: { model: 'question' | 'answer', placeholder: string, ariaLabel: string }[] = [
  { model: 'question', placeholder: 'Вопрос', ariaLabel: 'Термин' },
  { model: 'answer', placeholder: 'Ответ', ariaLabel: 'Определение' },
]
</script>

<template>
  <li>
    <template v-if="editingCard">
      <div
        v-for="field in inputFields"
        :key="field.model"
        class="card-item__edit-field"
      >
        <div
          :class="{ 'input--error': field.model === 'question' ? !isQuestionValid : !isAnswerValid }"
          contenteditable="true"
          class="card-item__input"
          :aria-label="field.ariaLabel"
          role="textbox"
          @input="updateContent(field.model, $event)"
          @blur="validate(field.model)"
          @keydown="handleKeyDown($event, field.model)"
          @paste="handlePaste"
          v-html="editedCard[field.model]"
        />
      </div>
      <div class="card-item__actions">
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
      </div>
    </template>
    <template v-else>
      <div class="card-item__block">
        <div
          class="card-item__review-info"
          :class="reviewStatus"
        >
          {{ nextReviewText }}
        </div>
        <div class="card-item__side left" v-html="card.question" />
        <div class="card-item__side right" v-html="card.answer" />
        <div class="card-item__edit">
          <TheButton
            variant="ghost"
            icon-only
            @click.stop="startEditing"
          >
            <TheIcon
              icon-name="pen-to-square"
              width="18px"
            />
          </TheButton>
          <TheButton
            variant="ghost"
            icon-only
            @click.stop="$emit('delete')"
          >
            <TheIcon
              icon-name="trash"
              width="18px"
            />
          </TheButton>
        </div>
      </div>
    </template>
  </li>
</template>

<style scoped src="./style.css" />
