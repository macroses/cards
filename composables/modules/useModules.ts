import { useAuth } from '#imports'
import { useToast } from '~/components/ui/toast/use-toast'

export function useModules () {
  const { data: authData } = useAuth()
  const { toast } = useToast()

  const modules = ref([])

  const fetchModules = async () => {
    if (!authData.value?.user) return

    try {
      modules.value = await $fetch<any>('/api/modules/modules', {
        query: { userId: authData.value.user.id }
      })
    } catch (error) {
      console.error('Ошибка при получении модулей:', error)
      toast({ variant: "destructive", description: 'Ошибка при получении модулей' })
    }
  }

  return {
    modules,
    fetchModules
  }
}