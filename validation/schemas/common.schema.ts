import { z } from 'zod'
import { validationRules } from '../rules/common.rules'

export function validationSchemas(t: (key: string) => string) {
  const rules = validationRules(t)

  return {
    loginSchema: z.object({
      email: rules.emailRule,
      password: rules.passwordRule,
    }),

    registrationSchema: z.object({
      email: rules.emailRule,
      password: rules.passwordRule,
      confirmPassword: rules.passwordRule,
    }).refine(data => data.password === data.confirmPassword, {
      message: t('validation.password.confirm_mismatch'),
      path: ['confirmPassword'],
    }),

    createExerciseSetSchema: z.object({
      weight: rules.weightRule,
      repeats: rules.repeatsRule,
    }),
  }
}
