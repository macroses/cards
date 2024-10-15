import type { Module } from '@/types/Module'
import { useAuth } from '#imports'

export function useModules() {
  const { data: authData } = useAuth()
  // const $toast = useToast()

  const modules = ref<Module[]>([])

  const fetchModules = async () => {
    if (!authData.value?.user)
      return

    try {
      modules.value = await $fetch<Module[]>('/api/modules/modules', {
        query: { userId: authData.value.user.id },
      })
    }
    catch (error: any) {
      console.error(error)
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!authData.value?.user)
      return

    try {
      await $fetch(`/api/modules/${moduleId}`, { method: 'DELETE' })

      modules.value = modules.value.filter(module => module.id !== moduleId)
    }
    catch (error: any) {
      console.error(error)
    }
  }

  const updateModule = async (
    moduleId: string,
    newName: string,
    newDescription: string,
  ) => {
    if (!authData.value?.user)
      return

    try {
      const updatedModule = await $fetch(`/api/modules/${moduleId}`, {
        method: 'PATCH',
        body: { name: newName, description: newDescription },
      })

      const index = modules.value.findIndex(m => m.id === moduleId)

      if (index !== -1) {
        modules.value[index] = updatedModule
      }
    }
    catch (error: any) {
      console.error(error)
    }
  }

  const createModule = async (name: string, description: string) => {
    if (!authData.value?.user) {
      return null
    }

    try {
      const newModule = await $fetch('/api/modules/modules', {
        method: 'POST',
        body: {
          name,
          userId: authData.value.user.id,
          description,
        },
      })

      modules.value.push(newModule)

      return newModule
    }
    catch (error) {
      console.error('Ошибка при создании модуля:', error)

      return null
    }
  }

  return {
    modules,
    fetchModules,
    deleteModule,
    updateModule,
    createModule,
  }
}
