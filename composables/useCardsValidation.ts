import { computed, ref } from 'vue'
import { createValidationRule } from '~/utils/validationRules'

export function useCardValidation() {
  const isQuestionValid = ref(true)
  const isAnswerValid = ref(true)

  const questionRules = [
    createValidationRule('required'),
    createValidationRule('maxLength', 1000),
  ]

  const answerRules = [
    createValidationRule('required'),
    createValidationRule('maxLength', 1000),
  ]

  const isSubmitAvailable = computed(() => isQuestionValid.value && isAnswerValid.value)

  function validate(field: 'question' | 'answer', value: string) {
    const rules = field === 'question' ? questionRules : answerRules

    for (const rule of rules) {
      const result = rule(value)
      if (!result.isValid) {
        if (field === 'question') {
          isQuestionValid.value = false
        }
        else {
          isAnswerValid.value = false
        }
        return false
      }
    }

    if (field === 'question') {
      isQuestionValid.value = true
    }
    else {
      isAnswerValid.value = true
    }
    return true
  }

  return {
    isQuestionValid,
    isAnswerValid,
    isSubmitAvailable,
    validate,
  }
}
