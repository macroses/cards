<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

const props = defineProps<{
  exercisesList: ExerciseServerTemplate[]
}>()

const myModalRef = ref<typeof TheModal | null>(null)
const userExercise = reactive<Omit<ExerciseServerTemplate, 'id'>>({
  name: '',
  muscleId: 1,
  primary: '',
  secondary: [],
  category: '',
  equipment: '',
  force: '',
  level: '',
})

const muscles = computed(() => {
  return props.exercisesList.map((group) => {
    return {
      id: group.muscleId,
      value: group.primary,
    }
  })
})

function handleOpenModal() {
  myModalRef.value?.openModal()
}

async function handleSubmit() {

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
              :dropdown-list="muscles"
              @active-value="userExercise.muscleId = $event.id"
            />
          </div>

          <div class="form-group">
            <label>Второстепенные мышцы</label>
          </div>

          <div class="form-group">
            <label>Тип упражнения</label>
          </div>

          <div class="form-group">
            <label>Категория</label>
          </div>

          <div class="form-group">
            <label>Оборудование</label>
          </div>

          <div class="form-group">
            <label>Тип нагрузки</label>
          </div>

          <div class="form-group">
            <label>Уровень сложности</label>
          </div>

          <div class="form-actions">
            <TheButton
              type="submit"
            >
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
