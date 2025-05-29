// validation/rules/common.rules.ts
import { z } from 'zod'

export function validationRules(t: (key: string) => string) {
  return {
    emailRule: z.string()
      .min(1, { message: t('validation.email.required') })
      .email({ message: t('validation.email.invalid') }),

    passwordRule: z.string()
      .min(6, { message: t('validation.password.min_length') }),

    weightRule: z.coerce.number()
      .min(1, { message: t('validation.weight.min') })
      .max(999, { message: t('validation.weight.max') }),

    repeatsRule: z.coerce.number()
      .min(1, { message: t('validation.repeats.min') })
      .max(999, { message: t('validation.repeats.max') }),
  }
}
