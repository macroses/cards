import type { NavigationItem } from '~/ts/interfaces'

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
  {
    tooltip: 'Documentation',
    path: '/documentation',
    icon: 'books',
    variant: 'ghost',
    ariaLabel: 'Documentation',
  },
] as const
