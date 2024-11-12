export interface Toast {
  id: number
  message: string
  type: ToastType
}

export type ToastType = 'success' | 'error' | 'info'
