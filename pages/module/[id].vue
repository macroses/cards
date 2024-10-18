<script lang="ts" setup>
import dayjs from 'dayjs'
import CreateCardForm from '~/components/Cards/CreateCardForm/CreateCardForm.vue'
import ModuleStats from '~/components/Module/ModuleStats/ModuleStats.vue'
import type { Card } from '~/types/Card'

const route = useRoute()
const moduleName = useState<string>('moduleName')
const moduleId = route.params.id as string
const createCardFormRef = ref<InstanceType<typeof CreateCardForm> | null>(null)

const {
  cards,
  fetchCards,
  deleteCard,
  updateCard,
} = useCards()

const { module, fetchModule } = useModules()

const showAddButton = ref(true)
const isReviewMode = ref(false)

const dueCards = computed(() => {
  return cards.value.filter((card) => {
    if (!card.nextReviewAt)
      return true
    return dayjs(card.nextReviewAt).isBefore(dayjs())
  })
})

const cardStats = computed(() => {
  const total = cards.value.length

  const due = cards.value.filter((card) => {
    if (!card.nextReviewAt)
      return true
    return dayjs(card.nextReviewAt).isBefore(dayjs())
  }).length

  const new_ = cards.value.filter(card => !card.lastReviewedAt).length
  const learning = total - due - new_

  return { total, due, new: new_, learning }
})

async function updateModuleStats() {
  await fetchCards(moduleId)
}

function toggleReviewMode() {
  isReviewMode.value = !isReviewMode.value
  if (!isReviewMode.value) {
    updateModuleStats()
  }
}

function scrollToBottom() {
  showAddButton.value = false
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
}

function handleScroll() {
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  showAddButton.value = scrollPosition < documentHeight - windowHeight

  if (!showAddButton.value) {
    nextTick(() => {
      createCardFormRef.value?.focusFirstInput()
    })
  }
}

function handleReviewCompleted() {
  isReviewMode.value = false
  updateModuleStats()
}

onMounted(async () => {
  if (!moduleName.value) {
    await fetchModule(moduleId)
  }

  await fetchCards(moduleId)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

useHead({
  title: computed(() => moduleName.value || module.value?.name || ''),
})
</script>

<template>
  <div class="card-container">
    <CardHeader
      v-if="module"
      :module="module"
      :module-name="moduleName"
    />

    <ModuleStats
      v-if="!isReviewMode"
      :card-stats="cardStats"
    />

    <TheButton
      :disabled="dueCards.length === 0"
      @click="toggleReviewMode"
    >
      {{ isReviewMode ? 'Выйти из режима повторения' : 'Начать повторение' }}
    </TheButton>

    <CardsSlider
      v-if="isReviewMode && dueCards.length > 0"
      :cards="dueCards"
      @review-completed="handleReviewCompleted"
    />

    <p v-else-if="isReviewMode && dueCards.length === 0">
      Нет карточек для повторения
    </p>
    <CardList
      v-else
      :cards="cards"
      @delete-card="deleteCard"
      @update-card="updateCard"
    />
    <CreateCardForm
      ref="createCardFormRef"
      :module-id="moduleId"
      @card-created="updateModuleStats"
    />
    <div class="card__add-item">
      <TheButton @click="scrollToBottom">
        <TheIcon
          fill="white"
          icon-name="plus"
          width="18px"
        />
        Добавить карточку
      </TheButton>
    </div>
  </div>
</template>
