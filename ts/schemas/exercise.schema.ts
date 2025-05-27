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

/*
 UserExercise
 */
export const userExerciseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  muscles: z.object({
    primary: z.string(),
    secondary: z.array(z.string()),
  }),
  characteristics: z.object({
    type: z.string(),
    category: z.string(),
    equipment: z.string(),
    force: z.string(),
    level: z.string(),
  }),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserExercise = z.infer<typeof userExerciseSchema>
