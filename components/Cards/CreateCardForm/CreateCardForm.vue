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

const isQuestionValid = ref(false)
const isAnswerValid = ref(false)
const questionRef = ref<HTMLDivElement | null>(null)
const answerRef = ref<HTMLDivElement | null>(null)

const questionRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 1000),
]

const answerRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 1000),
]

const isSubmitAvailable = computed(() => isQuestionValid.value && isAnswerValid.value)

function handleKeyDown(event: KeyboardEvent, field: 'question' | 'answer') {
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

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    const nextField = field === 'question' ? 'answer' : 'question'
    const nextRef = formRef.value?.querySelector(`[aria-label="${nextField === 'question' ? 'Термин' : 'Определение'}"]`) as HTMLDivElement

    if (!newCard[field].trim()) {
      nextRef?.focus()
    }
    else if (isSubmitAvailable.value) {
      handleCreateCard()
    }
    else {
      nextRef?.focus()
    }
  }
}

function trimAndNormalizeSpaces(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

function updateContent(field: 'question' | 'answer', event: Event) {
  const target = event.target as HTMLDivElement
  newCard[field] = trimAndNormalizeSpaces(target.innerHTML)
  validate(field)
}

function validate(field: 'question' | 'answer') {
  const rules = field === 'question' ? questionRules : answerRules
  const value = newCard[field]

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
}

function focusFirstInput() {
  if (formRef.value) {
    const firstInput = formRef.value.querySelector('[contenteditable="true"]') as HTMLDivElement
    firstInput?.focus()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain')

  if (text) {
    document.execCommand('insertText', false, text)
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
      aria-label="Термин"
      role="textbox"
      @input="updateContent('question', $event)"
      @blur="validate('question')"
      @keydown="handleKeyDown($event, 'question')"
      @paste="handlePaste"
    />
    <div
      ref="answerRef"
      contenteditable="true"
      class="create-card__input"
      :class="{ 'input--error': !isAnswerValid }"
      aria-label="Определение"
      role="textbox"
      @input="updateContent('answer', $event)"
      @blur="validate('answer')"
      @keydown="handleKeyDown($event, 'answer')"
      @paste="handlePaste"
    />
  </form>
</template>

<style scoped src="./style.css" />
