export interface InputProps {
  disabled?: boolean
  label?: string
  placeholder?: string
  type?: string
  mode?: 'text' | 'search' | 'url' | 'email' | 'none' | 'tel' | 'numeric' | 'decimal' | undefined
  value?: string | number
}
