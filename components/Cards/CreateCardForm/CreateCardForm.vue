<script lang="ts" setup>
const props = defineProps<{
  moduleId: string
}>()

const emit = defineEmits<{
  (e: 'cardCreated'): void
}>()

const { createCard } = useCards()
const $toast = useToast()
const formRef = ref<HTMLFormElement | null>(null)

const newCard = reactive({
  question: '',
  answer: '',
})

const {
  isQuestionValid,
  isAnswerValid,
  validate,
} = useCardValidation()

const { handleKeyDown, handlePaste, trimAndNormalizeSpaces } = useCardEditing(
  formRef,
  toRef(newCard),
  isQuestionValid,
  isAnswerValid,
  handleCreateCard,
)

const questionRef = ref<HTMLDivElement | null>(null)
const answerRef = ref<HTMLDivElement | null>(null)

const isSubmitAvailable = computed(() => {
  return isQuestionValid.value && isAnswerValid.value && newCard.question.trim() !== '' && newCard.answer.trim() !== ''
})

function updateContent(field: 'question' | 'answer', event: Event) {
  const target = event.target as HTMLDivElement
  newCard[field] = trimAndNormalizeSpaces(target.innerHTML)
  validate(field, newCard[field])
}

async function handleCreateCard() {
  if (isSubmitAvailable.value) {
    const trimmedCard = {
      question: trimAndNormalizeSpaces(newCard.question),
      answer: trimAndNormalizeSpaces(newCard.answer),
    }

    const createdCard = await createCard(trimmedCard, props.moduleId)

    $toast(createdCard ? 'Карточка создана' : 'Ошибка при создании карточки')

    newCard.question = ''
    newCard.answer = ''

    await nextTick()

    if (formRef.value) {
      const questionDiv = formRef.value.querySelector('[contenteditable="true"][aria-label="Термин"]')
      const answerDiv = formRef.value.querySelector('[contenteditable="true"][aria-label="Определение"]')

      if (questionDiv)
        questionDiv.textContent = ''
      if (answerDiv)
        answerDiv.textContent = ''
    }

    isQuestionValid.value = false
    isAnswerValid.value = false

    emit('cardCreated')
  }
  else {
    $toast('Пожалуйста, заполните оба поля: термин и определение')
  }
}

function focusFirstInput() {
  if (formRef.value) {
    const firstInput = formRef.value.querySelector('[contenteditable="true"]') as HTMLDivElement
    firstInput?.focus()
  }
}

defineExpose({ focusFirstInput })
</script>

<template>
  <form
    ref="formRef"
    @submit.prevent="handleCreateCard"
  >
    <div
      ref="questionRef"
      contenteditable="true"
      class="create-card__input"
      :class="{ 'input--error': !isQuestionValid }"
      aria-label="question"
      role="textbox"
      @input="updateContent('question', $event)"
      @blur="validate('question', newCard.question)"
      @keydown="handleKeyDown($event)"
      @paste="handlePaste"
    />
    <div
      ref="answerRef"
      contenteditable="true"
      class="create-card__input"
      :class="{ 'input--error': !isAnswerValid }"
      aria-label="answer"
      role="textbox"
      @input="updateContent('answer', $event)"
      @blur="validate('answer', newCard.answer)"
      @keydown="handleKeyDown($event)"
      @paste="handlePaste"
    />
  </form>
</template>

<style scoped src="./style.css" />
