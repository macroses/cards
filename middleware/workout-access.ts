import { PAGES } from '~/constants'
import { isApiError } from '~/ts/guards'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.query.edit) {
    return
  }

  const { data: session } = await useFetch('/api/auth/session')

  if (!session.value) {
    return await navigateTo(PAGES.LOGIN)
  }

  try {
    await $fetch('/api/workout/checkAccess', {
      query: { id: to.query.edit },
      headers: useRequestHeaders(['cookie']) as HeadersInit,
    })
  }
  catch (error: any) {
    if (isApiError(error)) {
      const isServer = useRuntimeConfig().app.ssrContext !== undefined

      if (!isServer) {
        return showError({
          statusCode: error.statusCode,
          message: error.message,
        })
      }

      throw createError({
        statusCode: error.statusCode,
        message: error.message,
      })
    }

    throw error
  }
})
