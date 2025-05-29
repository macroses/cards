type InputMode = 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal' | undefined

export default interface InputTextProps {
  type?: string
  inputmode?: InputMode
  placeholder?: string
  max?: number
  autocomplete?: string
  modelModifiers?: {
    number?: boolean
  }
  label?: string
  ariaLabel?: string
  ariaDescribedby?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  errorMessage?: string
}
