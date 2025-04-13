import { useToastState } from './useToastState'

export function useToast() {
  const { toast, customToast } = useToastState()
  return {
    toast,
    customToast,
  }
}
