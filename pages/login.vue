<script setup lang="ts">
import type { Provider } from 'next-auth/providers/index'
import { validationSchemas } from '@/validation/schemas/common.schema'

definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { data: providers } = await useFetch<Provider[]>('/api/auth/providers')
const { onSubmit, status, authError } = useAuthSubmit()
const { t } = useI18n()
const { loginSchema, registrationSchema } = validationSchemas(t)

const isRegistration = shallowRef(false)

const validationSchema = computed(() =>
  toTypedSchema(isRegistration.value ? registrationSchema : loginSchema),
)

const { errors, defineField, handleSubmit, meta } = useForm({ validationSchema })

const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')

const submitForm = handleSubmit(async (values) => {
  await onSubmit(
    meta.value.valid,
    isRegistration.value,
    values.email,
    values.password,
  )
})
</script>

<template>
  <div class="auth">
    <form
      class="auth-form"
      @submit.prevent="submitForm"
    >
      <h2>{{ isRegistration ? 'Регистрация' : 'Вход' }}</h2>

      <TheInput
        v-model="email"
        type="email"
        name="email"
        placeholder="Email"
        :error-message="errors.email"
      />

      <TheInput
        v-model="password"
        name="password"
        type="password"
        placeholder="Password"
        :error-message="errors.password"
      />

      <TheInput
        v-if="isRegistration"
        v-model="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Подтвердите пароль"
        :error-message="errors.confirmPassword"
      />

      <div v-if="authError" class="error">
        {{ authError }}
      </div>

      <TheButton
        type="submit"
        :disabled="!meta.valid || status === 'loading'"
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
