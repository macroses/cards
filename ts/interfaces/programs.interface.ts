import { z } from 'zod'

export const mainSettingsSchema = z.object({
  weeksCounter: z.number()
    .min(3, { message: 'Не менее 2' })
    .max(12, { message: 'Не более 12' }),

  startPMPercent: z.number()
    .min(40, { message: 'Не менее 40' })
    .max(100, { message: 'Не более 100' }),

  pmpIncreasePercent: z.number()
    .min(0, { message: 'Не менее 0' })
    .max(100, { message: 'Не более 100' }),

  weekNumber: z.number()
    .min(2, { message: 'Не менее 2' })
    .max(12, { message: 'Не более 12' }),

  weekPMPercentDecrease: z.number()
    .min(0, { message: 'Не менее 0' })
    .max(100, { message: 'Не более 100' }),

  weekTrainingFrequency: z.number()
    .min(1, { message: 'Не менее 1' })
    .max(7, { message: 'Не более 7' }),
}).refine(data => data.weekNumber <= data.weeksCounter, {
  message: 'Не больше общего количества недель',
  path: ['weekNumber'],
}).refine(data => data.weeksCounter % data.weekNumber === 0, {
  message: 'Не кратно количеству недель',
  path: ['weekNumber'],
})

export type MainSettingsFields = z.infer<typeof mainSettingsSchema>
