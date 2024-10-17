<script lang="ts" setup>
import CreateCardForm from '~/components/Cards/CreateCardForm/CreateCardForm.vue'

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

    <CardsSlider
      v-if="cards.length > 2"
      :cards="cards"
    />
    <CardList
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
