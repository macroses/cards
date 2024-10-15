<script lang="ts" setup>
import type { InputField } from './interface'

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

const isQuestionValid = ref(true)
const isAnswerValid = ref(true)

const questionRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 200),
]

const answerRules = [
  createValidationRule('required'),
  createValidationRule('maxLength', 200),
]

const isSubmitAvailable = computed(() => isQuestionValid.value && isAnswerValid.value)

async function handleCreateCard() {
  if (isSubmitAvailable.value) {
    const createdCard = await createCard(newCard, props.moduleId)

    $toast(createdCard ? 'Карточка создана' : 'Ошибка при создании карточки')

    newCard.question = ''
    newCard.answer = ''

    await nextTick()

    if (formRef.value) {
      formRef.value.reset()
    }

    emit('cardCreated')
  }
}

const inputFields: InputField[] = [
  {
    model: 'question',
    placeholder: 'Вопрос',
    required: true,
    rules: questionRules,
    onValidation: isValid => isQuestionValid.value = isValid,
  },
  {
    model: 'answer',
    placeholder: 'Ответ',
    required: true,
    rules: answerRules,
    onValidation: isValid => isAnswerValid.value = isValid,
  },
]
</script>

<template>
  <form
    ref="formRef"
    @submit.prevent="handleCreateCard"
  >
    <TheInput
      v-for="field in inputFields"
      :key="field.model"
      v-model="newCard[field.model]"
      :placeholder="field.placeholder"
      :required="field.required || false"
      :validate-rules="field.rules"
      @validation="field.onValidation"
    />
    <TheButton
      type="submit"
      :disabled="!isSubmitAvailable"
    >
      <TheIcon
        fill="white"
        icon-name="floppy-disk"
        width="18px"
      />
    </TheButton>
  </form>
</template>
