import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(() => {
  const path = resolve('./data/exercises.json')
  const exercises: ExerciseServerTemplate[] = JSON.parse(readFileSync(path, 'utf-8'))
  return exercises // возвращаем оригинальный массив без группировки
})
