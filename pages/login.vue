<script setup lang="ts">
import type { Provider } from 'next-auth/providers/index'
import { PAGES } from '~/constants'

definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { data: providers } = await useFetch<Provider[]>('/api/auth/providers')
const { signIn } = useAuth()

const isRegistration = shallowRef(false)
const email = shallowRef('')
const password = shallowRef('')
const error = shallowRef('')
const isValid = shallowRef(false)

async function handleSubmit() {
  if (!isValid.value) {
    return
  }

  try {
    if (isRegistration.value) {
      // Регистрация
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email: email.value, password: password.value },
      })
    }

    // Вход
    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false, // Изменено на false для ручной обработки
    })

    if (result?.error) {
      error.value = result.error
    }
    else {
      await navigateTo(PAGES.HOME)
    }
  }
  catch (err: any) {
    error.value = err.message || 'Произошла ошибка'
  }
}
</script>

<template>
  <div class="auth">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h2>{{ isRegistration ? 'Регистрация' : 'Вход' }}</h2>

      <TheInput
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
        label="Email"
        :aria-required="true"
        :validate-rules="[
          createValidationRule('required'),
          createValidationRule('email'),
        ]"
        @validation="isValid = $event"
      />

      <TheInput
        v-model="password"
        type="password"
        placeholder="Пароль"
        autocomplete="current-password"
        label="Пароль"
        :aria-required="true"
        :validate-rules="[
          createValidationRule('required'),
          createValidationRule('minLength', 6),
        ]"
        @validation="isValid = $event"
      />

      <p v-if="error" class="error" role="alert" aria-live="assertive">
        {{ error }}
      </p>

      <TheButton
        type="submit"
        :disabled="!isValid"
      >
        {{ isRegistration ? 'Зарегистрироваться' : 'Войти' }}
      </TheButton>

      <p class="toggle-mode">
        {{ isRegistration ? 'Уже есть аккаунт?' : 'Нет аккаунта?' }}
        <button type="button" @click="isRegistration = !isRegistration">
          {{ isRegistration ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </p>
    </form>

    <div class="social-auth">
      <ProviderLogin
        v-for="provider in providers"
        :key="provider.id"
        :provider-name="provider.name"
      />
    </div>
  </div>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-white);
}

.error {
  color: var(--color-error);
  font-size: 14px;
}

.toggle-mode {
  text-align: center;
  font-size: 14px;

  button {
    color: var(--color-accent);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
  }
}

.social-auth {
  display: flex;
  gap: 16px;
}
</style>
