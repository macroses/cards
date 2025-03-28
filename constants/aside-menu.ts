import type { ButtonVariant } from '~/ts/componentProps'

interface NavigationItem {
  tooltip: string
  path: string
  icon: string
  variant: ButtonVariant
  ariaLabel: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    tooltip: 'Home',
    path: '/',
    icon: 'house-window',
    variant: 'secondary',
    ariaLabel: 'Home',
  },
  {
    tooltip: 'Training programs',
    path: '/programs',
    icon: 'book-open-cover',
    variant: 'ghost',
    ariaLabel: 'Training programs',
  },
  {
    tooltip: 'Body parameters',
    path: '/body-parameters',
    icon: 'ruler-triangle',
    variant: 'ghost',
    ariaLabel: 'Body parameters',
  },
]
