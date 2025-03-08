<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'

const myModalRef = ref<typeof TheModal | null>(null)

const userExercise = reactive({
  name: '',
  muscles: {
    muscleId: 1,
    primary: '',
    secondary: [] as string[],
  },
  characteristics: {
    type: '',
    category: '',
    equipment: '',
    force: '',
    level: '',
  },
  description: '',
})

// Константы для селектов
const muscleGroups = [
  { value: 'lats', label: 'Широчайшие' },
  { value: 'legs', label: 'Ноги' },
  { value: 'chest', label: 'Грудь' },
  { value: 'shoulders', label: 'Плечи' },
  { value: 'biceps', label: 'Бицепс' },
  { value: 'triceps', label: 'Трицепс' },
]

const exerciseTypes = [
  { value: 'basic', label: 'Базовое' },
  { value: 'isolation', label: 'Изолирующее' },
]

const categories = [
  { value: 'strength', label: 'Сила' },
  { value: 'cardio', label: 'Кардио' },
]

const equipment = [
  { value: 'machines', label: 'Тренажеры' },
  { value: 'barbell', label: 'Штанга' },
  { value: 'dumbbells', label: 'Гантели' },
  { value: 'bodyweight', label: 'Вес тела' },
]

const forceTypes = [
  { value: 'pull', label: 'Тяга' },
  { value: 'push', label: 'Жим' },
]

const levels = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'novice', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
]

function handleOpenModal() {
  myModalRef.value?.openModal()
}

function handleSubmit() {
  // Здесь будет логика сохранения
  console.log('Сохраняем упражнение:', userExercise)
}
</script>

<template>
  <div class="my_exercises">
    <TheButton @click="handleOpenModal">
      + Добавить
    </TheButton>

    <LazyTheModal ref="myModalRef">
      <template #title>
        <h3>Создать упражнение</h3>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <TheInput
              v-model.trim="userExercise.name"
              placeholder="Название упражнения"
              :validate-rules="[createValidationRule('required')]"
              :max="50"
            />
          </div>

          <div class="form-group">
            <label>Основная мышечная группа</label>
            <TheSelect
              v-model="userExercise.muscles.primary"
              :options="muscleGroups"
              placeholder="Выберите группу мышц"
            />
          </div>

          <div class="form-group">
            <label>Дополнительные мышцы</label>
            <TheSelect
              v-model="userExercise.muscles.secondary"
              :options="muscleGroups"
              multiple
              placeholder="Выберите дополнительные мышцы"
            />
          </div>

          <div class="form-group">
            <label>Тип упражнения</label>
            <TheRadioGroup
              v-model="userExercise.characteristics.type"
              :options="exerciseTypes"
              name="type"
            />
          </div>

          <div class="form-group">
            <label>Категория</label>
            <TheRadioGroup
              v-model="userExercise.characteristics.category"
              :options="categories"
              name="category"
            />
          </div>

          <div class="form-group">
            <label>Оборудование</label>
            <TheSelect
              v-model="userExercise.characteristics.equipment"
              :options="equipment"
              placeholder="Выберите оборудование"
            />
          </div>

          <div class="form-group">
            <label>Тип нагрузки</label>
            <TheRadioGroup
              v-model="userExercise.characteristics.force"
              :options="forceTypes"
              name="force"
            />
          </div>

          <div class="form-group">
            <label>Уровень сложности</label>
            <TheSelect
              v-model="userExercise.characteristics.level"
              :options="levels"
              placeholder="Выберите уровень"
            />
          </div>

          <div class="form-group">
            <label>Описание</label>
            <TheTextarea
              v-model.trim="userExercise.description"
              placeholder="Описание упражнения"
              :max="500"
            />
          </div>

          <div class="form-actions">
            <TheButton type="submit">
              Сохранить
            </TheButton>
          </div>
        </form>
      </template>
    </LazyTheModal>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
