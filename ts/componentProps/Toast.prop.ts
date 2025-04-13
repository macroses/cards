import type { Component } from 'vue'

export interface Toast {
  id: number
  message?: string
  type: ToastType
  component?: Component
  componentProps?: Record<string, any>
}

export type ToastType = 'success' | 'error' | 'info' | 'custom'

export interface ToastProps {
  ms: number
  hasClose: boolean
}
