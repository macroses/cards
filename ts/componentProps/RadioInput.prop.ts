export interface RadioInputProps<T> {
  name: string
  value: string | number | boolean | null | undefined
  label?: string
  disabled?: boolean
  modelValue?: T
}
