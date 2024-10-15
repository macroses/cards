<script lang="ts" setup>
import type { Card } from '~/types/Card'

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
  updateCard,
} = useCards()

const $toast = useToast()

const newCard = ref({
  question: '',
  answer: '',
})

const editingCardId = ref<string | null>(null)
const editedCard = ref({
  question: '',
  answer: '',
})

const goBack = () => router.back()

async function handleCreateCard() {
  const createdCard = await createCard(newCard.value, moduleId)

  $toast(createdCard ? 'Карточка создана' : 'Ошибка при создании карточки')

  if (createdCard) {
    newCard.value = {
      question: '',
      answer: '',
    }
  }
}

const handleDeleteCard = async (cardId: string) => await deleteCard(cardId)

function startEditing(card: Card) {
  editingCardId.value = card.id
  editedCard.value = { ...card }
}

const cancelEditing = () => editingCardId.value = null

async function saveEdit() {
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
  { model: 'question', placeholder: 'Вопрос', required: true },
  { model: 'answer', placeholder: 'Ответ', required: true },
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
        icon-name="angle-left" width="18px"
      />
      {{ t('back') }}
    </TheButton>

    folder name: {{ moduleName }}

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
          icon-name="floppy-disk"
          width="18px"
        />
      </TheButton>
    </form>

    <div v-if="cards.length > 0">
      <div
        v-for="card in cards"
        :key="card.id"
      >
        <template v-if="editingCardId === card.id">
          <div
            v-for="field in inputFields"
            :key="field.model"
          >
            <TheInput
              v-model="editedCard[field.model]"
              :placeholder="field.placeholder"
            />
          </div>
          <button @click="saveEdit">
            Сохранить
          </button>
          <button @click="cancelEditing">
            Отмена
          </button>
        </template>
        <template v-else>
          <button @click="handleDeleteCard(card.id)">
            Удалить
          </button>
          <button @click="startEditing(card)">
            Редактировать
          </button>
          <p><strong>Вопрос:</strong> {{ card.question }}</p>
          <p><strong>Ответ:</strong> {{ card.answer }}</p>
        </template>
      </div>
    </div>
    <p v-else>
      В этом модуле пока нет карточек.
    </p>
  </div>
</template>
