<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Card } from '~/types/Card'
// import 'dayjs/locale/ru'

const props = defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'update', updatedCard: Partial<Card>): void
}>()

dayjs.extend(relativeTime)
dayjs.locale('ru')

const { isQuestionValid, isAnswerValid, validate } = useCardValidation()
const { handleKeyDown, handlePaste, trimAndNormalizeSpaces } = useCardEditing()

const editingCard = ref(false)
const editedCard = ref({ ...props.card })

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

function updateContent(field: 'question' | 'answer', event: Event) {
  const target = event.target as HTMLDivElement
  editedCard.value[field] = trimAndNormalizeSpaces(target.innerHTML)
  validate(field, editedCard.value[field])
}

const nextReviewText = computed(() => {
  if (!props.card.nextReviewAt)
    return 'new'

  const nextReview = dayjs(props.card.nextReviewAt)
  const now = dayjs()

  if (nextReview.isBefore(now)) {
    return 'ready'
  }

  const diff = nextReview.diff(now, 'minute')

  if (diff < 60) return `${diff}м`
  if (diff < 1440) return `${Math.floor(diff / 60)}h`
  if (diff < 43200) return `${Math.floor(diff / 1440)}d`
  return `${Math.floor(diff / 43200)}мес`
})

const reviewStatus = computed(() => {
  if (!props.card.nextReviewAt) {
    return 'empty'
  }

  const nextReview = dayjs(props.card.nextReviewAt)

  if (nextReview.isBefore(dayjs())) {
    return 'low'
  }

  return 'high'
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
          @blur="validate(field.model, editedCard[field.model])"
          @keydown="handleKeyDown($event)"
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
        <div class="card-item__side left" v-html="card.question" />
        <div class="card-item__side right" v-html="card.answer" />
        <div class="card-item__badge">
          <Badge :variant="reviewStatus">
            {{ nextReviewText }}
          </Badge>
        </div>
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
