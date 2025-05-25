<script setup lang="ts">
interface MainSettingsFields {
  weeksCounter: number
  startPMPercent: number
  pmpIncreasePercent: number
  weekNumber: number
  weekPMPercentDecrease: number
  weekTrainingFrequency: number
}

const { t } = useI18n()

const mainSettingsFields = reactive<MainSettingsFields>({
  weeksCounter: 4,
  startPMPercent: 65,
  pmpIncreasePercent: 1.5,
  weekNumber: 4,
  weekPMPercentDecrease: 30,
  weekTrainingFrequency: 3,
})

interface Field {
  key: keyof MainSettingsFields
  label: string
}

const fields: Field[] = [
  { key: 'weeksCounter', label: t('program_settings.weeks_counter') },
  { key: 'startPMPercent', label: t('program_settings.start_pm') },
  { key: 'pmpIncreasePercent', label: t('program_settings.increase_per_week') },
  { key: 'weekNumber', label: t('program_settings.deload_week_number') },
  { key: 'weekPMPercentDecrease', label: t('program_settings.deload_week_level') },
  { key: 'weekTrainingFrequency', label: t('program_settings.training_frequency') },
]
</script>

<template>
  <div class="program__main-settings">
    <dl class="program__main-settings__list">
      <div
        v-for="field in fields"
        :key="field.key"
        class="program__main-settings__item"
      >
        <dt>{{ field.label }}</dt>
        <dd>
          <TheInput
            v-model.number="mainSettingsFields[field.key]"
            placeholder=""
            value
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<style src="./style.css" />
