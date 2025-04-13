import type { CreateWorkoutResponse, UserTrainingSession } from '~/ts/interfaces'
import type { NewRecord, PersonalRecord, RecordType } from '~/ts/types/personalRecords.types'
import { KEYS } from '~/constants'

type RecordToastFunction = (records: NewRecord[], options?: { ms?: number }) => void

// Глобальная функция для отображения уведомлений о рекордах
const recordToastFunction = ref<RecordToastFunction>(() => {
  console.warn('Record toast function is not yet initialized')
})

export function usePersonalRecords() {
  const personalRecords = useState<Record<string, PersonalRecord[]>>(KEYS.PERSONAL_RECORDS_KEY, () => ({}))
  const newRecords = ref<NewRecord[]>([])

  /**
   * Проверяет один сет на наличие личных рекордов
   */
  function checkPersonalRecord(
    set: UserTrainingSession,
    exerciseName: string,
    workouts: CreateWorkoutResponse[] | null,
    showToast: boolean = false,
  ) {
    if (!workouts || !workouts.length) {
      return false
    }

    const { exerciseId, weight, repeats } = set
    const volume = weight * repeats

    const previousSets = workouts
      .filter(workout => workout.completed)
      .flatMap(({ sets }) => {
        return sets.filter(s => s.exerciseId === exerciseId)
      })

    const maxWeight = Math.max(0, ...previousSets.map(({ weight }) => weight || 0))

    if (weight > maxWeight && weight > 0) {
      addNewRecord({
        type: 'weight',
        value: weight,
        exerciseId,
        exerciseName,
        previousValue: maxWeight,
      })
    }

    const maxVolume = Math.max(0, ...previousSets.map(({ weight, repeats }) => (weight || 0) * (repeats || 0)))
    if (volume > maxVolume && volume > 0) {
      addNewRecord({
        type: 'volume',
        value: volume / 1000,
        exerciseId,
        exerciseName,
        previousValue: maxVolume / 1000,
      })
    }

    const hasNewRecords = newRecords.value.length > 0

    // Показываем уведомление только если явно запрошено
    if (hasNewRecords && showToast) {
      recordToastFunction.value([...newRecords.value])
    }

    return hasNewRecords
  }

  /**
   * Проверяет всю тренировку на наличие личных рекордов
   */
  function checkPersonalRecords(
    workout: CreateWorkoutResponse,
    allWorkouts: CreateWorkoutResponse[],
  ) {
    if (!workout || !allWorkouts.length) {
      return false
    }

    // Очищаем предыдущие рекорды
    clearNewRecords()

    // Проверяем каждый сет в тренировке
    for (const set of workout.sets) {
      const exerciseName = workout.exercises.find(({ exerciseId }) => exerciseId === set.exerciseId)?.exerciseName || ''
      checkPersonalRecord(set, exerciseName, allWorkouts)
    }

    // Если есть новые рекорды, показываем уведомление
    if (newRecords.value.length > 0) {
      recordToastFunction.value([...newRecords.value], { ms: 60000 })
      return true
    }

    return false
  }

  function addNewRecord(record: NewRecord) {
    const existingRecord = newRecords.value.find(({ type, exerciseId }) => type === record.type && exerciseId === record.exerciseId)

    if (existingRecord) {
      if (record.value > existingRecord.value) {
        Object.assign(existingRecord, record)
      }
    }
    else {
      newRecords.value.push(record)
    }

    savePersonalRecord({
      type: record.type,
      value: record.value,
      exerciseId: record.exerciseId,
      exerciseName: record.exerciseName,
      date: new Date(),
    })
  }

  function savePersonalRecord(record: PersonalRecord) {
    const key = `${record.exerciseId}-${record.type}`

    if (!personalRecords.value[key]) {
      personalRecords.value[key] = []
    }

    personalRecords.value[key].push(record)
    personalRecords.value[key].sort((a, b) => b.value - a.value)

    if (personalRecords.value[key].length > 10) {
      personalRecords.value[key] = personalRecords.value[key].slice(0, 10)
    }
  }

  function clearNewRecords() {
    newRecords.value = []
  }

  function getBestRecord(exerciseId: string, type: RecordType): PersonalRecord | null {
    const key = `${exerciseId}-${type}`

    if (!personalRecords.value[key] || personalRecords.value[key].length === 0) {
      return null
    }

    return personalRecords.value[key][0]
  }

  function setRecordToastFunction(fn: RecordToastFunction) {
    recordToastFunction.value = fn
  }

  return {
    personalRecords,
    newRecords,
    checkPersonalRecord,
    checkPersonalRecords,
    clearNewRecords,
    getBestRecord,
    setRecordToastFunction,
  }
}
