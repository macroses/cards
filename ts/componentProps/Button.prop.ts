type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'transparent'

type ButtonType = 'button' | 'submit' | 'reset'

interface ButtonBaseProps {
  disabled?: boolean
  type?: ButtonType
  variant?: ButtonVariant
}

interface ButtonProps extends ButtonBaseProps {
  iconOnly?: boolean
}

interface ButtonLinkProps extends ButtonBaseProps {
  link?: boolean
  linkPath?: string
}

export type ButtonLinkOrBaseProps = ButtonProps | ButtonLinkProps
