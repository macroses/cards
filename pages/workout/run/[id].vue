<script setup lang="ts">
import TheInput from '@/components/ui/TheInput/TheInput.vue'

interface EditingState {
  setId: string | null
  field: 'weight' | 'repeats' | null
}

const { runWorkout, initRunMode, originalWorkout } = useRunWorkout()
const { endWorkout } = useFinishWorkout()

async function handleFinishWorkout() {
  if (runWorkout.value) {
    const success = await endWorkout(runWorkout.value.id)

    if (success) {
      navigateTo('/')
    }
  }
}

const exerciseSets = computed(() => {
  if (!runWorkout.value) {
    return {}
  }

  return runWorkout.value.sets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = []
    }

    acc[set.exerciseId].push(set)

    return acc
  }, {} as Record<number, typeof runWorkout.value.sets>)
})

const editingState = ref<EditingState>({
  setId: null,
  field: null,
})

const inputRefs = ref<Record<string, InstanceType<typeof TheInput>>>({})

function handleEdit(setId: string, field: 'weight' | 'repeats') {
  editingState.value = { setId, field }

  nextTick(() => {
    if (inputRefs.value[setId]) {
      inputRefs.value[setId]?.focus()
    }
  })
}

function handleInputSubmit() {
  editingState.value = { setId: null, field: null }
}

function setInputRef(setId: string): (el: any) => void {
  return (el) => {
    if (el) {
      inputRefs.value[setId] = el
    }
  }
}

onMounted(async () => await initRunMode())
</script>

<template>
  <div
    v-if="runWorkout"
    class="run"
  >
    <div class="run__current">
      <button @click="handleFinishWorkout">
        finish
      </button>
      <h1 class="run__title">
        {{ runWorkout.title }}
      </h1>
      <ul class="run__exercises-list">
        <li
          v-for="exercise in runWorkout.exercises"
          :key="exercise.exerciseId"
          class="run__exercise-item"
        >
          <div class="run__exercise">
            {{ exercise.exerciseName }}
          </div>
          <ul
            v-if="exerciseSets[exercise.exerciseId]?.length"
            class="run__sets"
          >
            <li
              v-for="set in exerciseSets[exercise.exerciseId]"
              :key="set.id"
              class="run__set-item"
            >
              <div
                class="run__set-difficulty"
              >
                {{ set.difficulty }}
              </div>
              <div
                class="run__set-weight"
                @click="handleEdit(set.id, 'weight')"
              >
                <TheInput
                  v-if="editingState.setId === set.id && editingState.field === 'weight'"
                  :ref="setInputRef(set.id)"
                  v-model="set.weight"
                  placeholder="Вес"
                  type="number"
                  inputmode="numeric"
                  @keyup.enter="handleInputSubmit"
                  @blur="handleInputSubmit"
                />
                <span v-else>
                  {{ set.weight }}
                </span>
              </div>
              <div
                class="run__set-repeats"
                @click="handleEdit(set.id, 'repeats')"
              >
                <TheInput
                  v-if="editingState.setId === set.id && editingState.field === 'repeats'"
                  :ref="setInputRef(set.id)"
                  v-model="set.repeats"
                  placeholder="Повторения"
                  type="number"
                  inputmode="numeric"
                  @keyup.enter="handleInputSubmit"
                  @blur="handleInputSubmit"
                />
                <span v-else>
                  {{ set.repeats }}
                </span>
              </div>
              <TheButton
                variant="ghost"
                icon-only
              >
                <TheIcon
                  icon-name="circle-check"
                  width="18px"
                />
              </TheButton>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="run__initial">
      {{ originalWorkout }}
      <!--      <ul> -->
      <!--        <li v-for="item in originalWorkout" :key="item.id"> -->
      <!--          {{ item }} -->
      <!--        </li> -->
      <!--      </ul> -->
    </div>
  </div>
  <div v-else>
    Тренировка не найдена
  </div>
</template>
