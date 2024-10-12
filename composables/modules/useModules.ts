import { useAuth } from '#imports'
import { useToast } from '~/components/ui/toast/use-toast'

interface Module {
  id: string;
  name: string;
}

export function useModules () {
  const { data: authData } = useAuth()
  const { toast } = useToast()

  const modules = ref<Module[]>([])

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

  const deleteModule = async (moduleId: string) => {
    if (!authData.value?.user) return

    try {
      await $fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE'
      })
      toast({ description: 'Модуль успешно удален' })
      modules.value = modules.value.filter(module => module.id !== moduleId)
    } catch (error) {
      console.error('Ошибка при удалении модуля:', error)
      toast({ variant: "destructive", description: 'Ошибка при удалении модуля' })
    }
  }

  return {
    modules,
    fetchModules,
    deleteModule
  }
}