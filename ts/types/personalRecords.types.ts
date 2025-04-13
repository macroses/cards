export type RecordType = 'weight' | 'volume'

export interface PersonalRecord {
  type: RecordType
  value: number
  exerciseId: string
  exerciseName: string
  date: Date
}

export type NewRecord = Omit<PersonalRecord, 'date'> & {
  previousValue: number
}
