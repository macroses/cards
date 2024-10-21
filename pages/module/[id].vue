<script lang="ts" setup>
import dayjs from 'dayjs'
import CreateCardForm from '~/components/Cards/CreateCardForm/CreateCardForm.vue'
import ModuleStats from '~/components/Module/ModuleStats/ModuleStats.vue'

const route = useRoute()
const router = useRouter()
const $toast = useToast()

const moduleId = route.params.id as string
const showAddButton = ref(true)
const isReviewMode = ref(false)
const createCardFormRef = ref<InstanceType<typeof CreateCardForm> | null>(null)

const {
  cards,
  fetchCards,
  deleteCard,
  updateCard,
} = useCards()

const { module, fetchModule } = useModules()

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
  try {
    await fetchModule(moduleId)
    await fetchCards(moduleId)
    window.addEventListener('scroll', handleScroll)
  }
  catch (error: any) {
    if (error.statusCode === 403) {
      $toast('У вас нет доступа к этому модулю')
      router.push('/modules')
    }
    else {
      $toast('Произошла ошибка при загрузке модуля')
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

useHead({
  title: computed(() => module.value?.name || ''),
})
</script>

<template>
  <CardHeader
    v-if="module"
    :module="module"
    :module-name="module.name"
  />
  <div class="card-wrapper">
    <div class="card-wrapper__content">
      <div class="card-repeats__functions">
        <ModuleRepeatModes
          @cards="toggleReviewMode"
        />
      </div>

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
        v-if="!isReviewMode"
        ref="createCardFormRef"
        :module-id="moduleId"
        @card-created="updateModuleStats"
      />
      <!--      <div -->
      <!--        v-if="!isReviewMode" -->
      <!--        class="card__add-item" -->
      <!--      > -->
      <!--        <TheButton @click="scrollToBottom"> -->
      <!--          <TheIcon -->
      <!--            fill="white" -->
      <!--            icon-name="plus" -->
      <!--            width="18px" -->
      <!--          /> -->
      <!--          Добавить карточку -->
      <!--        </TheButton> -->
      <!--      </div> -->
    </div>
    <div class="card-wrapper__sidebar">
      <ModuleStats :card-stats="cardStats" />
    </div>
  </div>
</template>
