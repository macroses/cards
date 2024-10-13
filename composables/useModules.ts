import { useAuth } from '#imports'

interface Module {
  id: string;
  name: string;
}

export function useModules () {
  const { data: authData } = useAuth()

  const modules = ref<Module[]>([])

  const fetchModules = async () => {
    if (!authData.value?.user) return

    try {
      modules.value = await $fetch<Module[]>('/api/modules/modules', {
        query: { userId: authData.value.user.id }
      })
    } catch (error) {
      console.error('Ошибка при получении модулей:', error)
      console.log({
        variant: "destructive",
        description: 'Ошибка при получении модулей'
      })
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!authData.value?.user) return

    try {
      await $fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE'
      })
      console.log({ description: 'Модуль успешно удален' })
      modules.value = modules.value.filter(module => module.id !== moduleId)
    } catch (error) {
      console.error('Ошибка при удалении модуля:', error)
      console.log({ variant: "destructive", description: 'Ошибка при удалении модуля' })
    }
  }

  const updateModule = async (moduleId: string, newName: string) => {
    if (!authData.value?.user) return
  
    try {
      const updatedModule = await $fetch(`/api/modules/${moduleId}`, {
        method: 'PATCH',
        body: { name: newName }
      })
      console.log({ description: 'Модуль успешно обновлен' })
      const index = modules.value.findIndex(m => m.id === moduleId)
      if (index !== -1) {
        modules.value[index] = updatedModule
      }
    } catch (error) {
      console.error('Ошибка при обновлении модуля:', error)
      console.log({ variant: "destructive", description: 'Ошибка при обновлении модуля' })
    }
  }


  const createModule = async (name: string, description: string) => {
    if (!authData.value?.user) return
  
    try {
      const newModule = await $fetch('/api/modules/modules', {
        method: 'POST',
        body: {
          name,
          userId: authData.value.user.id,
          description
        }
      })
      console.log({ description: 'Модуль успешно создан' })
      modules.value.push(newModule)
      return newModule
    } catch (error) {
      console.error('Ошибка при создании модуля:', error)
      console.log({ variant: "destructive", description: 'Ошибка при создании модуля' })
      return null
    }
  }

  return {
    modules,
    fetchModules,
    deleteModule,
    updateModule,
    createModule
  }
}