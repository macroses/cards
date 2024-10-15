export interface InputField {
  model: 'question' | 'answer'
  placeholder: string
  required?: boolean
  rules: any[]
  onValidation: (isValid: boolean) => void
}
