import { z } from 'zod'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

/*
  Workout set created by a user
 */
export const trainingSessionSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  weight: z.number().positive(),
  repeats: z.number().positive(),
  difficulty: z.nativeEnum(DIFFICULT_LEVEL),
  completed: z.boolean(),
  setTime: z.number().nullable().optional(),
  setTimeAddedAt: z.string().nullable().optional(),
})

export type TrainingSession = z.infer<typeof trainingSessionSchema>

// Short exercise
export const workoutExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>

/*
  Workout request
 */
export const workoutRequestSchema = z.object({
  title: z.string(),
  color: z.string(),
  workoutDate: z.date(),
  exercises: z.array(workoutExerciseSchema),
  sessions: z.array(trainingSessionSchema),
})

export type WorkoutRequest = z.infer<typeof workoutRequestSchema>

/*
  Workout response from a server
 */
export const workoutResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  color: z.string(),
  workoutDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completed: z.boolean(),
  startedAt: z.date().nullable().optional(),
  endedAt: z.date().nullable().optional(),
  exercises: z.array(workoutExerciseSchema),
  sets: z.array(trainingSessionSchema),
})

export type WorkoutResponse = z.infer<typeof workoutResponseSchema>

/*
 UserWorkout
 */
export const userWorkoutSchema = z.object({
  title: z.string(),
  color: z.string(),
  exercises: z.array(workoutExerciseSchema),
  sessions: z.array(trainingSessionSchema),
  workoutDate: z.date(),
  completed: z.boolean(),
  id: z.string().optional(),
  startedAt: z.date().nullable(),
  endedAt: z.date().nullable(),
})

export type UserWorkout = z.infer<typeof userWorkoutSchema>
