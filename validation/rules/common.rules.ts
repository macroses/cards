// validation/rules/common.rules.ts
import { z } from 'zod'

export const emailRule = z.string()
  .min(1, { message: 'Email обязателен для заполнения' })
  .email({ message: 'Введите корректный email адрес' })

export const passwordRule = z.string()
  .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
