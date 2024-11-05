import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Exercise } from '~/types/Exercise'

export default defineEventHandler(() => {
  const path = resolve('./data/exercises.json')
  const exercises: Exercise[] = JSON.parse(readFileSync(path, 'utf-8'))

  // Группируем упражнения по primary muscle
  const groupedExercises = exercises.reduce((acc, exercise) => {
    const primary = exercise.muscles.primary
    if (!acc[primary]) {
      acc[primary] = []
    }
    acc[primary].push(exercise)
    return acc
  }, {} as Record<string, Exercise[]>)

  // Преобразуем в массив групп
  const result = Object.entries(groupedExercises).map(([primary, exercises]) => ({
    primary,
    exercises,
  }))

  return result
})
