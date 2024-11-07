interface Rule {
  (value: string): {
    isValid: boolean
    message: string
  }
}

export default interface Props {
  type?: string
  noClear?: boolean
  inputmode?: 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal'
  placeholder: string
  validateRules?: Rule[]
}
