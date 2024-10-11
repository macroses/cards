<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCards } from "@/composables/cards/useCards"
import { useToast } from '@/components/ui/toast/use-toast'

const route = useRoute()
const moduleId = route.params.id as string

const {
  cards,
  fetchCards,
  createCard,
  deleteCard
} = useCards()
const { toast } = useToast()

const newCard = shallowRef({
  question: '',
  answer: '',
  title: '',
  tags: '',
  partOfSpeech: '',
  exampleSentence: ''
})

onMounted(() => {
  fetchCards(moduleId)
})

const goBack = () => {
  navigateTo('/modules')
}

const handleCreateCard = async () => {
  // if (!newCard.value.question || !newCard.value.answer) {
  //   toast({ variant: "destructive", description: 'Вопрос и ответ обязательны' })
  //   return
  // }

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
    toast({ description: 'Карточка успешно создана' })
  }
}

const handleDeleteCard = async (cardId: string) => {
    await deleteCard(cardId)
}
</script>

<template>
  <div>
    <Button @click="goBack" class="mb-4">Назад</Button>
    <h1 class="text-2xl font-bold mb-4">Карточки модуля</h1>

    <!-- Форма создания карточки -->
    <div class="mb-8 p-4 border rounded-lg">
      <h2 class="text-xl font-bold mb-4">Создать новую карточку</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input v-model="newCard.title" placeholder="Заголовок" />
        <Input v-model="newCard.question" placeholder="Вопрос" required />
        <Input v-model="newCard.answer" placeholder="Ответ" required />
        <Input v-model="newCard.partOfSpeech" placeholder="Часть речи" />
        <Input v-model="newCard.exampleSentence" placeholder="Пример предложения" />
        <Input v-model="newCard.tags" placeholder="Теги (через запятую)" />
      </div>
      <Button @click="handleCreateCard" class="mt-4">Создать карточку</Button>
    </div>

    <!-- Список карточек -->
    <div v-if="cards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="card in cards" :key="card.id" class="border rounded-lg p-4 shadow-sm relative">
        <Button @click="handleDeleteCard(card.id)" class="absolute top-2 right-2" variant="destructive" size="sm">
            Удалить
        </Button>
        <h4 class="font-bold mb-2">{{ card.title || 'Без заголовка' }}</h4>
        <p><strong>Вопрос:</strong> {{ card.question }}</p>
        <p><strong>Ответ:</strong> {{ card.answer }}</p>
        <p v-if="card.partOfSpeech"><strong>Часть речи:</strong> {{ card.partOfSpeech }}</p>
        <p v-if="card.exampleSentence"><strong>Пример:</strong> {{ card.exampleSentence }}</p>
        <p v-if="card.tags"><strong>Теги:</strong> {{ card.tags }}</p>
        </div>
    </div>
    <p v-else>В этом модуле пока нет карточек.</p>
  </div>
</template>