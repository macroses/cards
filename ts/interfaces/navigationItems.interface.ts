import type { ButtonVariant } from '~/ts/componentProps'

export interface NavigationItem {
  tooltip: string
  path: string
  icon: string
  variant: ButtonVariant
  ariaLabel: string
}
