import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ExerciseServerTemplate } from '~/ts/interfaces/ExerciseServerTemplate.interface'

export default defineEventHandler(() => {
  const path = resolve('./data/exercises.json')
  const exercises: ExerciseServerTemplate[] = JSON.parse(readFileSync(path, 'utf-8'))

  // Группируем упражнения по primary muscle
  const groupedExercises = exercises.reduce((acc, exercise) => {
    const primary = exercise.muscles.primary
    if (!acc[primary]) {
      acc[primary] = []
    }
    acc[primary].push(exercise)
    return acc
  }, {} as Record<string, ExerciseServerTemplate[]>)

  // Преобразуем в массив групп
  return Object.entries(groupedExercises).map(([primary, exercises]) => ({
    primary,
    exercises,
  }))
})
