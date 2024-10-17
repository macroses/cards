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

const handleCreateCard = async () => {
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

const focusFirstInput = () => {
  if (formRef.value) {
    const firstInput = formRef.value.querySelector('input')
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
    <TheInput
      v-model="newCard.question"
      placeholder="Термин"
      :required="true"
      :validate-rules="questionRules"
      class="create-card__input"
      @validation="isQuestionValid = $event"
    />
    <TheInput
      v-model="newCard.answer"
      placeholder="Определение"
      :required="true"
      :validate-rules="answerRules"
      class="create-card__input"
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

<style scoped src="./style.css" />
