import type { MainSettingsFields } from '~/ts/interfaces'

interface Field {
  key: keyof MainSettingsFields
  label: string
}

// weeksCounter - maxValue 12
// startPMPercent - maxValue 100
// pmpIncreasePercent - maxValue 100
// weekNumber - maxValue 12
// weekPMPercentDecrease - maxValue 100
// weekTrainingFrequency - maxValue 7
export const MAIN_SETTINGS_FIELDS: Field[] = [
  { key: 'weeksCounter', label: 'program_settings.weeks_counter' },
  { key: 'startPMPercent', label: 'program_settings.start_pm' },
  { key: 'pmpIncreasePercent', label: 'program_settings.increase_per_week' },
  { key: 'weekNumber', label: 'program_settings.deload_week_number' },
  { key: 'weekPMPercentDecrease', label: 'program_settings.deload_week_level' },
  { key: 'weekTrainingFrequency', label: 'program_settings.training_frequency' },
] as const
