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
</script>

<template>
  <form
    ref="formRef"
    @submit.prevent="handleCreateCard"
  >
    <TheInput
      v-model="newCard.question"
      placeholder="Вопрос"
      :required="true"
      :validate-rules="questionRules"
      @validation="isQuestionValid = $event"
    />
    <TheInput
      v-model="newCard.answer"
      placeholder="Ответ"
      :required="true"
      :validate-rules="answerRules"
      @validation="isAnswerValid = $event"
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
