import type { CreateWorkoutResponse, UserTrainingSession } from '~/ts/interfaces'
import type { NewRecord, PersonalRecord, RecordType } from '~/ts/types/personalRecords.types'
import { KEYS } from '~/constants'

export function usePersonalRecords() {
  const personalRecords = useState<Record<string, PersonalRecord[]>>(KEYS.PERSONAL_RECORDS_KEY, () => ({}))
  const newRecords = ref<NewRecord[]>([])

  function checkPersonalRecord(
    set: UserTrainingSession,
    exerciseName: string,
    workouts: CreateWorkoutResponse[] | null,
  ) {
    if (!workouts || !workouts.length) {
      return false
    }

    const { exerciseId, weight, repeats } = set
    const volume = weight * repeats

    const previousSets = workouts
      .filter(workout => workout.completed)
      .flatMap((workout) => {
        return workout.sets.filter(s => s.exerciseId === exerciseId)
      })

    const maxWeight = Math.max(0, ...previousSets.map(previousSet => previousSet.weight || 0))

    if (weight > maxWeight && weight > 0) {
      addNewRecord({
        type: 'weight',
        value: weight,
        exerciseId,
        exerciseName,
        previousValue: maxWeight,
      })
    }

    const setsWithSameWeight = previousSets.filter(s => Math.abs(s.weight - weight) < 0.1)
    const maxReps = Math.max(0, ...setsWithSameWeight.map(s => s.repeats || 0))
    if (repeats > maxReps && repeats > 0 && setsWithSameWeight.length > 0) {
      addNewRecord({
        type: 'repeats',
        value: repeats,
        exerciseId,
        exerciseName,
        previousValue: maxReps,
      })
    }

    const maxVolume = Math.max(0, ...previousSets.map(s => (s.weight || 0) * (s.repeats || 0)))
    if (volume > maxVolume && volume > 0) {
      addNewRecord({
        type: 'volume',
        value: volume,
        exerciseId,
        exerciseName,
        previousValue: maxVolume,
      })
    }

    return newRecords.value.length > 0
  }

  function addNewRecord(record: NewRecord) {
    const existingRecord = newRecords.value.find(r => r.type === record.type && r.exerciseId === record.exerciseId)

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

  return {
    personalRecords,
    newRecords,
    checkPersonalRecord,
    clearNewRecords,
    getBestRecord,
  }
}
