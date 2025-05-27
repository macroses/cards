import type { TrainingSession, WorkoutResponse } from '~/ts'
import type { NewRecord, PersonalRecord, RecordType } from '~/ts/types/personalRecords.types'
import {
  KEYS,
  RECORDS,
  TOAST_DURATIONS,
} from '~/constants'

type RecordToastFunction = (records: NewRecord[], options?: { ms?: number }) => void

// Глобальная функция для отображения уведомлений о рекордах
const recordToastFunction = ref<RecordToastFunction>(() => {
  console.warn('Record toast function is not yet initialized')
})

export function usePersonalRecords() {
  const personalRecords = useState<Record<string, PersonalRecord[]>>(KEYS.PERSONAL_RECORDS_KEY, () => ({}))
  const newRecords = ref<NewRecord[]>([])

  const createRecordKey = (exerciseId: string, type: RecordType | string): string => `${exerciseId}-${type}`

  /**
   * Проверяет один сет на наличие личных рекордов
   */
  function checkPersonalRecord(
    set: TrainingSession,
    exerciseName: string,
    workouts: WorkoutResponse[] | null,
    showToast = false,
  ) {
    if (!workouts?.length) {
      return false
    }

    const { exerciseId, weight, repeats } = set
    const volume = weight * repeats

    const previousSets = workouts
      .filter(({ completed }) => completed)
      .flatMap(({ sets }) => {
        return sets.filter(set => set.exerciseId === exerciseId)
      })

    const maxWeight = Math.max(0, ...previousSets.map(({ weight }) => weight || 0))

    if (weight > maxWeight && weight > 0) {
      addNewRecord({
        type: RECORDS.WEIGHT,
        value: weight,
        exerciseId,
        exerciseName,
        previousValue: maxWeight,
      })
    }

    const maxVolume = Math.max(0, ...previousSets.map(({ weight, repeats }) => {
      return (weight || 0) * (repeats || 0)
    }))

    if (volume > maxVolume && volume > 0) {
      addNewRecord({
        type: RECORDS.VOLUME,
        value: volume / RECORDS.VOLUME_TO_TONS,
        exerciseId,
        exerciseName,
        previousValue: maxVolume / RECORDS.VOLUME_TO_TONS,
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
    workout: WorkoutResponse,
    allWorkouts: WorkoutResponse[],
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
      recordToastFunction.value([...newRecords.value], { ms: TOAST_DURATIONS.RECORD_NOTIFICATION })
      return true
    }

    return false
  }

  function addNewRecord(record: NewRecord) {
    const existingRecord = newRecords.value.find(({ type, exerciseId }) => type === record.type && exerciseId === record.exerciseId)

    if (existingRecord && record.value > existingRecord.value) {
      Object.assign(existingRecord, record)
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
    const key = createRecordKey(record.exerciseId, record.type)

    if (!personalRecords.value[key]) {
      personalRecords.value[key] = []
    }

    personalRecords.value[key].push(record)
    personalRecords.value[key].sort((a, b) => b.value - a.value)

    if (personalRecords.value[key].length > RECORDS.MAX_RECORDS_PER_TYPE) {
      personalRecords.value[key] = personalRecords.value[key].slice(0, RECORDS.MAX_RECORDS_PER_TYPE)
    }
  }

  function clearNewRecords() {
    newRecords.value = []
  }

  function getBestRecord(exerciseId: string, type: RecordType): PersonalRecord | null {
    const key = createRecordKey(exerciseId, type)
    const records = personalRecords.value[key]

    return records?.length ? records[0] : null
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
