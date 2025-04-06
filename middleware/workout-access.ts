import { PAGES } from '~/constants'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.query.edit) {
    return
  }

  const { data: session } = await useFetch('/api/auth/session')

  if (!session.value) {
    return navigateTo(PAGES.LOGIN)
  }

  try {
    await $fetch('/api/workout/checkAccess', {
      query: { id: to.query.edit },
      headers: useRequestHeaders(['cookie']) as HeadersInit,
    })
  }
  catch (error: any) {
    const isServer = useRuntimeConfig().app.ssrContext !== undefined

    if (isServer) {
      throw createError({
        statusCode: error.statusCode || 404,
        message: error.message || 'Тренировка не найдена',
      })
    }
    else {
      return showError({
        statusCode: error.statusCode || 404,
        message: error.message || 'Тренировка не найдена',
      })
    }
  }
})
