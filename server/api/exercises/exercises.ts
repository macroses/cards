import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  const path = resolve('./data/exercises.json')
  const exercises: ExerciseServerTemplate[] = JSON.parse(readFileSync(path, 'utf-8'))
  return exercises // возвращаем оригинальный массив без группировки
})
