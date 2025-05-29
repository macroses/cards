import { object, z } from 'zod'

export const mainSettingsSchema = object({
  weeksCounter: z.number()
    .int()
    .min(4, { message: 'Значение должно быть не менее 4' })
    .max(12, { message: 'Значение должно быть не более 12' }),

  startPMPercent: z.number()
    .min(40, { message: 'Значение должно быть не менее 40' })
    .max(100, { message: 'Значение должно быть не более 100' }),

  pmpIncreasePercent: z.number()
    .min(0, { message: 'Значение должно быть не менее 0' })
    .max(100, { message: 'Значение должно быть не более 100' }),

  weekNumber: z.number()
    .int()
    .min(1, { message: 'Значение должно быть не менее 1' })
    .max(12, { message: 'Значение должно быть не более 12' }),

  weekPMPercentDecrease: z.number()
    .min(0, { message: 'Значение должно быть не менее 0' })
    .max(100, { message: 'Значение должно быть не более 100' }),

  weekTrainingFrequency: z.number()
    .int()
    .min(1, { message: 'Значение должно быть не менее 1' })
    .max(7, { message: 'Значение должно быть не более 7' }),
})

export type MainSettingsFields = z.infer<typeof mainSettingsSchema>
