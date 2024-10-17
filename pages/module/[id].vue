<script lang="ts" setup>
import dayjs from 'dayjs'
import CreateCardForm from '~/components/Cards/CreateCardForm/CreateCardForm.vue'
import type { Card } from '~/types/Card'

const route = useRoute()
const moduleName = useState<string>('moduleName')
const moduleId = route.params.id as string
const createCardFormRef = ref<InstanceType<typeof CreateCardForm> | null>(null)
const { t } = useI18n()

const {
  cards,
  fetchCards,
  deleteCard,
  updateCard,
} = useCards()

const { module, fetchModule } = useModules()

const showAddButton = ref(true)
const isReviewMode = ref(false)
const dueCards = ref([])

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

const fetchDueCards = async () => {
  try {
    dueCards.value = await $fetch<Card[]>(`/api/cards/due?moduleId=${moduleId}`)
  }
  catch (error) {
    console.error('Ошибка при получении карточек для повторения:', error)
  }
};

const toggleReviewMode = () => {
  isReviewMode.value = !isReviewMode.value
  if (isReviewMode.value) {
    fetchDueCards()
  }
};

const scrollToBottom = () => {
  showAddButton.value = false
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
};

const handleScroll = () => {
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
    <div class="card-container__header">
      <TheButton
        variant="outline"
        @click="navigateTo('/modules')"
      >
        <TheIcon
          icon-name="angle-left"
          width="18px"
        />
        {{ t('back') }}
      </TheButton>

      <h1>{{ moduleName || module?.name }}</h1>
    </div>

    <div class="module-stats">
      <h3>Статистика модуля:</h3>
      <p>Всего карточек: {{ cardStats.total }}</p>
      <p>Готово к повторению: {{ cardStats.due }}</p>
      <p>Новых: {{ cardStats.new }}</p>
      <p>В процессе изучения: {{ cardStats.learning }}</p>
    </div>

    <TheButton @click="toggleReviewMode">
      {{ isReviewMode ? 'Выйти из режима повторения' : 'Начать повторение' }}
    </TheButton>

    <CardsSlider
      v-if="isReviewMode && dueCards.length > 0"
      :cards="dueCards"
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
      @card-created="fetchCards(moduleId)"
    />
    <div
      class="card__add-item"
    >
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
