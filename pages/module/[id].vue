<script setup lang="ts">
const route = useRoute()
const moduleName = useState<string>('moduleName')
const moduleId = route.params.id as string

const {
  cards,
  fetchCards,
  createCard,
  deleteCard,
  updateCard
} = useCards()

const newCard = shallowRef({
  question: '',
  answer: '',
  title: '',
  tags: '',
  partOfSpeech: '',
  exampleSentence: ''
})

const editingCardId = ref<string | null>(null)
const editedCard = shallowRef({
  question: '',
  answer: '',
  title: '',
  tags: '',
  partOfSpeech: '',
  exampleSentence: ''
})

const goBack = () => {
  navigateTo('/modules')
}

const handleCreateCard = async () => {
  const createdCard = await createCard(newCard.value, moduleId)
  if (createdCard) {
    newCard.value = {
      question: '',
      answer: '',
      title: '',
      tags: '',
      partOfSpeech: '',
      exampleSentence: ''
    }
  }
}

const handleDeleteCard = async (cardId: string) => {
  await deleteCard(cardId)
}

const startEditing = (card: Card) => {
  editingCardId.value = card.id
  editedCard.value = { ...card }
}

const cancelEditing = () => {
  editingCardId.value = null
}

const saveEdit = async () => {
  if (editingCardId.value) {
    await updateCard(editingCardId.value, editedCard.value)
    editingCardId.value = null
    console.log({ description: 'Карточка успешно обновлена' })
  }
}

onMounted(async () => {
  await fetchCards(moduleId)
})

useHead({
  title: moduleName.value,
})
</script>

<template>
  <div>
    <button @click="goBack">Назад</button>

    folder name: {{ moduleName }}
    <!-- Форма создания карточки -->
    <div class="mb-8 p-4 border rounded-lg">
      <h2 class="text-xl font-bold mb-4">Создать новую карточку</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newCard.title" placeholder="Заголовок" />
        <input v-model="newCard.question" placeholder="Вопрос" required />
        <input v-model="newCard.answer" placeholder="Ответ" required />
        <input v-model="newCard.partOfSpeech" placeholder="Часть речи" />
        <input v-model="newCard.exampleSentence" placeholder="Пример предложения" />
        <input v-model="newCard.tags" placeholder="Теги (через запятую)" />
      </div>
      <button @click="handleCreateCard">Создать карточку</button>
    </div>

    <!-- Список карточек -->
    <div v-if="cards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="card in cards" :key="card.id" class="border rounded-lg p-4 shadow-sm relative">
        <template v-if="editingCardId === card.id">
          <input v-model="editedCard.title" placeholder="Заголовок" class="mb-2" />
          <input v-model="editedCard.question" placeholder="Вопрос" class="mb-2" />
          <input v-model="editedCard.answer" placeholder="Ответ" class="mb-2" />
          <input v-model="editedCard.partOfSpeech" placeholder="Часть речи" class="mb-2" />
          <input v-model="editedCard.exampleSentence" placeholder="Пример предложения" class="mb-2" />
          <input v-model="editedCard.tags" placeholder="Теги (через запятую)" class="mb-2" />
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
          <p v-if="card.partOfSpeech"><strong>Часть речи:</strong> {{ card.partOfSpeech }}</p>
          <p v-if="card.exampleSentence"><strong>Пример:</strong> {{ card.exampleSentence }}</p>
          <p v-if="card.tags"><strong>Теги:</strong> {{ card.tags }}</p>
        </template>
      </div>
    </div>
    <p v-else>В этом модуле пока нет карточек.</p>
  </div>
</template>