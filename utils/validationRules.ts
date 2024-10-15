import { useI18n } from 'vue-i18n'

type ValidationRule = (value: string, ...args: any[]) => {
  isValid: boolean
  message: string
}

export function useValidationRules() {
  const { t } = useI18n()

  const validationRules: Record<string, ValidationRule> = {
    required: (value: string) => ({
      isValid: !!value.trim(),
      message: t('validation.required'),
    }),

    maxLength: (value: string, maxLength: number) => ({
      isValid: value.length <= maxLength,
      message: t('validation.maxLength', { maxLength }),
    }),

    minLength: (value: string, minLength: number) => ({
      isValid: value.length >= minLength,
      message: t('validation.minLength', { minLength }),
    }),

    // ...
  }

  return validationRules
}

export function createValidationRule(ruleName: string, ...args: any[]) {
  const rules = useValidationRules()
  return (value: string) => rules[ruleName](value, ...args)
}
