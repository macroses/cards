type InputMode = 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal' | undefined

export default interface InputTextProps {
  type?: string
  noClear?: boolean
  inputmode?: InputMode
  placeholder: string
  max?: number
  autocomplete?: string
  modelModifiers?: {
    number?: boolean
  }
  validateRules?: Array<(value: string) => ValidationResult>
}

interface ValidationResult {
  isValid: boolean
  message: string
}
