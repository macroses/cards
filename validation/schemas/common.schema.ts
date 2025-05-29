import { z } from 'zod'
import { emailRule, passwordRule, repeatsRule, weightRule } from '../rules/common.rules'

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

export const createExerciseSetSchema = z.object({
  weight: weightRule,
  repeats: repeatsRule,
})
