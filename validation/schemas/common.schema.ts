import { z } from 'zod'
import { emailRule, passwordRule } from '../rules/common.rules'

export const loginSchema = z.object({
  email: emailRule,
  password: passwordRule,
})

export const registrationSchema = z.object({
  email: emailRule,
  password: passwordRule,
  confirmPassword: passwordRule,
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})
