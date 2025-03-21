export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'transparent'

export type ButtonType = 'button' | 'submit' | 'reset'

export interface ButtonBaseProps {
  disabled?: boolean
  type?: ButtonType
  variant?: ButtonVariant
}

export interface ButtonProps extends ButtonBaseProps {
  iconOnly?: boolean
}

export interface ButtonLinkProps extends ButtonBaseProps {
  link: boolean
  linkPath: string
}

export type ButtonLinkOrBaseProps = ButtonProps | ButtonLinkProps
