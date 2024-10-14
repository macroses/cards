type ValidationRule = (value: string, ...args: any[]) => {
  isValid: boolean
  message: string 
}

const validationRules: Record<string, ValidationRule> = {
  required: (value: string) => ({
    isValid: !!value.trim(),
    message: 'Обязательно для заполнения'
  }),
  
  maxLength: (value: string, maxLength: number) => ({
    isValid: value.length <= maxLength,
    message: `Максимальная длина ${maxLength} символов`
  }),
  
  minLength: (value: string, minLength: number) => ({
    isValid: value.length >= minLength,
    message: `Минимальная длина ${minLength} символов`
  }),
  
  // ...
}

export const createValidationRule = (ruleName: string, ...args: any[]) => {
  return (value: string) => validationRules[ruleName](value, ...args)
}