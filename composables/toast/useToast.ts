import { useToastState } from './useToastState'

export function useToast() {
  const { toast } = useToastState()
  return toast
}
