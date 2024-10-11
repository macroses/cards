<script setup lang="ts">
import { useModules } from "@/composables/modules/useModules"
import { useCards } from "@/composables/cards/useCards"

const { modules, fetchModules } = useModules()
const { cards, fetchCards, createCard } = useCards()

const selectedModuleId = ref<string | null>(null)
const cardData = ref({
  question: '',
  answer: '',
  title: '',
  tags: '',
  partOfSpeech: '',
  exampleSentence: '',
})

const inputFields = [
  { model: 'question', placeholder: 'Вопрос' },
  { model: 'answer', placeholder: 'Ответ' },
  { model: 'title', placeholder: 'Заголовок' },
  { model: 'tags', placeholder: 'Теги (через запятую)' },
  { model: 'partOfSpeech', placeholder: 'Часть речи' },
  { model: 'exampleSentence', placeholder: 'Пример предложения' },
]

const selectModule = (moduleId: string) => {
  selectedModuleId.value = moduleId
  fetchCards(moduleId)
}

const handleCreateCard = async () => {
  if (!selectedModuleId.value) {
    return
  }

  const newCard = await createCard(cardData.value, selectedModuleId.value)
  if (newCard) {
    cardData.value = {
      question: '',
      answer: '',
      title: '',
      tags: '',
      partOfSpeech: '',
      exampleSentence: '',
    }
  }
}

onMounted(fetchModules)
defineExpose({ fetchModules })
</script>

<template>
  <div>
    <h1>Ваши папки</h1>
    <ul>
      <li v-for="module in modules" :key="module.id" @click="selectModule(module.id)">
        {{ module.name }}
      </li>
    </ul>

    <div v-if="selectedModuleId" class="mt-4">
      <h3 class="text-xl font-bold mb-2">Создать карточку</h3>
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-for="field in inputFields"
          :key="field.model"
          v-model="cardData[field.model as keyof typeof cardData]"
          :placeholder="field.placeholder"
        />
      </div>
      <Button @click="handleCreateCard" class="mt-4">Создать карточку</Button>
    </div>

    <div v-if="selectedModuleId" class="mt-8">
      <h3 class="text-xl font-bold mb-4">Карточки модуля</h3>
      <div v-if="cards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="card in cards" :key="card.id" class="border rounded-lg p-4 shadow-sm">
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
  </div>
</template>
