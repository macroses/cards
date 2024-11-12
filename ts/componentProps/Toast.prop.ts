export interface Toast {
  id: number
  message: string
  type: ToastType
}

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  ms: number
  hasClose: boolean
}
