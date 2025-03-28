export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'transparent'
  | 'success'
  | 'warning'

type ButtonType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  disabled?: boolean
  type?: ButtonType
  variant?: ButtonVariant
  iconOnly?: boolean
  link?: boolean
  linkPath?: string
}
