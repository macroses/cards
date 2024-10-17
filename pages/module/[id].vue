<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const moduleName = useState<string>('moduleName')
const moduleId = route.params.id as string
const { t } = useI18n()

const {
  cards,
  fetchCards,
  deleteCard,
  updateCard,
} = useCards()

const { module, fetchModule } = useModules()

onMounted(async () => {
  if (!moduleName.value) {
    await fetchModule(moduleId)
  }

  await fetchCards(moduleId)
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
        @click="router.back()"
      >
        <TheIcon
          fill="white"
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
      :module-id="moduleId"
      @card-created="fetchCards(moduleId)"
    />
    <div class="card__add-item">
      <TheButton>
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
