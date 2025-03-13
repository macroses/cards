<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

const props = defineProps<{
  exercisesList: ExerciseServerTemplate[]
}>()

const myModalRef = ref<typeof TheModal | null>(null)

const muscles = computed(() => {
  const uniqueMuscles = new Set(props.exercisesList.map(exercise => exercise.primary))

  return Array.from(uniqueMuscles).map(muscleName => ({
    id: props.exercisesList.find(ex => ex.primary === muscleName)?.muscleId || 0,
    value: muscleName,
  }))
})

const userExercise = reactive<Omit<ExerciseServerTemplate, 'id'>>({
  name: '',
  muscleId: muscles.value[0].id,
  primary: muscles.value[0].value,
  secondary: [],
  category: '',
  equipment: '',
  force: '',
  level: '',
})

const chosenSecondaryMuscles = computed(() => {
  return userExercise.secondary.map(muscleName => ({
    id: props.exercisesList.find(ex => ex.primary === muscleName)?.muscleId || 0,
    value: muscleName,
  }))
})

const availableSecondaryMuscles = computed(() => {
  return muscles.value.filter(muscle => muscle.value !== userExercise.primary)
})

function addSecondaryMuscles(item: { id: number, value: string }) {
  if (!userExercise.secondary.includes(item.value)) {
    userExercise.secondary.push(item.value)
  }
}

function removeSecondaryMuscles() {
  userExercise.secondary = []
}

function handleOpenModal() {
  myModalRef.value?.openModal()
}

async function handleSubmit() {

}

watch(() => userExercise.primary, (newPrimary) => {
  // Удаляем из второстепенных мышц ту, которая стала основной
  userExercise.secondary = userExercise.secondary.filter(muscle => muscle !== newPrimary)
})
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
              v-model:id="userExercise.muscleId"
              v-model:value="userExercise.primary"
              :dropdown-list="muscles"
            />
          </div>

          <div class="form-group">
            <label>Второстепенные мышцы</label>
            <TheMultiSelect
              label="Main muscle"
              :multiselect-list="availableSecondaryMuscles"
              :chosen-items="chosenSecondaryMuscles"
              @remove-items="removeSecondaryMuscles"
              @get-items="addSecondaryMuscles"
            />
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
