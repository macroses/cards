import { PAGES } from '~/constants'

export function useAuthSubmit() {
  const { signIn, status } = useAuth()
  const authError = ref<string | null>(null)

  async function onSubmit(
    isValid: boolean,
    isRegistration: boolean,
    email: string,
    password: string,
  ) {
    if (!isValid) {
      return
    }

    try {
      if (isRegistration) {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            email,
            password,
          },
        })
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        authError.value = result.error === 'CredentialsSignin'
          ? 'Неверный email или пароль'
          : 'Произошла ошибка при входе'
        return
      }

      await navigateTo(PAGES.HOME)
    }
    catch (error) {
      console.error(error)
      authError.value = 'Произошла ошибка при входе'
    }
  }

  return {
    onSubmit,
    status,
    authError,
  }
}
