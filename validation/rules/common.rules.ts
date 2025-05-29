// validation/rules/common.rules.ts
import { z } from 'zod'

export const emailRule = z.string()
  .min(1, { message: 'Email обязателен для заполнения' })
  .email({ message: 'Введите корректный email адрес' })

export const passwordRule = z.string()
  .min(6, { message: 'Пароль должен содержать минимум 6 символов' })

export const weightRule = z.coerce.number()
  .min(1, { message: 'Минимум 1кг' })
  .max(999, { message: 'Максимум 999кг' })

export const repeatsRule = z.coerce.number()
  .min(1, { message: 'Минимум 1 повтор' })
  .max(999, { message: 'Максимум 999 повторов' })
