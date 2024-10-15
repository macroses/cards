<script lang="ts" setup>
import type {Card} from '~/types/Card'

type CardField = 'question' | 'answer'

const route = useRoute()
const router = useRouter()
const moduleName = useState<string>('moduleName')
const moduleId = route.params.id as string
const { t } = useI18n()

const {
  cards,
  fetchCards,
  createCard,
  deleteCard,
  updateCard
} = useCards()

const newCard = ref({
  question: '',
  answer: ''
})

const editingCardId = ref<string | null>(null)
const editedCard = ref({
  question: '',
  answer: ''
})

const goBack = () => router.back()

const handleCreateCard = async () => {
  const createdCard = await createCard(newCard.value, moduleId)

  if (createdCard) {
    newCard.value = {
      question: '',
      answer: ''
    }
  }
}

const handleDeleteCard = async (cardId: string) => await deleteCard(cardId)

const startEditing = (card: Card) => {
  editingCardId.value = card.id
  editedCard.value = {...card}
}

const cancelEditing = () => editingCardId.value = null

const saveEdit = async () => {
  if (editingCardId.value) {
    await updateCard(editingCardId.value, editedCard.value)
    editingCardId.value = null
  }
}

onMounted(async () => await fetchCards(moduleId))

useHead({
  title: moduleName.value,
})

const inputFields: { model: CardField, placeholder: string, required?: boolean }[] = [
  {model: 'question', placeholder: 'Вопрос', required: true},
  {model: 'answer', placeholder: 'Ответ', required: true}
]
</script>

<template>
  <div>
    <TheButton
      variant="outline"
      @click="goBack"
    >
      <TheIcon
        fill="white"
        iconName="angle-left" width="18px"
      />
      {{ t('back') }}
    </TheButton>

    folder name:
    {{ moduleName }}
    <!-- Форма создания карточки -->
    <form @submit.prevent="handleCreateCard">
      <TheInput
        v-for="field in inputFields" :key="field.model"
        v-model="newCard[field.model]"
        :placeholder="field.placeholder"
        :required="field.required || false"
      />
      <TheButton type="submit">
        <TheIcon
          fill="white"
          iconName="floppy-disk"
          width="18px"
        />
      </TheButton>
    </form>

    <!-- Список карточек -->
    <div v-if="cards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="card in cards" :key="card.id" class="border rounded-lg p-4 shadow-sm relative">
        <template v-if="editingCardId === card.id">
          <div v-for="field in inputFields" :key="field.model">
            <TheInput
                v-model="editedCard[field.model]"
                :placeholder="field.placeholder"
            />
          </div>
          <button @click="saveEdit">Сохранить</button>
          <button @click="cancelEditing">Отмена</button>
        </template>
        <template v-else>
          <button @click="handleDeleteCard(card.id)">
            Удалить
          </button>
          <button @click="startEditing(card)">
            Редактировать
          </button>
          <h4 class="font-bold mb-2">{{ card.title || 'Без заголовка' }}</h4>
          <p><strong>Вопрос:</strong> {{ card.question }}</p>
          <p><strong>Ответ:</strong> {{ card.answer }}</p>
        </template>
      </div>
    </div>
    <p v-else>В этом модуле пока нет карточек.</p>
  </div>
</template>