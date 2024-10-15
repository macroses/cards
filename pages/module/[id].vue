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

onMounted(async () => await fetchCards(moduleId))

useHead({
  title: moduleName.value,
})
</script>

<template>
  <div>
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

    <h1>{{ moduleName }}</h1>

    <CreateCardForm
      :module-id="moduleId"
      @card-created="fetchCards(moduleId)"
    />

    <CardList
      :cards="cards"
      @delete-card="deleteCard"
      @update-card="updateCard"
    />
  </div>
</template>
