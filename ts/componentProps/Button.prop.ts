export interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'transparent'
  iconOnly?: boolean
  link?: boolean
  linkPath?: string
}
