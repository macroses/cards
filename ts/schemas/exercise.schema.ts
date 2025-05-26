import { z } from 'zod'

export const exerciseTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  muscleId: z.number(),
  primary: z.string(),
  secondary: z.array(z.string()),
  category: z.string(),
  equipment: z.string(),
  force: z.string(),
  level: z.string(),
})

export type ExerciseTemplate = z.infer<typeof exerciseTemplateSchema>
