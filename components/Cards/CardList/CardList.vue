<script lang="ts" setup>
import type { Card } from '~/types/Card'

defineProps<{
  cards: Card[]
}>()

const emit = defineEmits<{
  (e: 'deleteCard', cardId: string): void
  (e: 'updateCard', cardId: string, updatedCard: Partial<Card>): void
}>()
</script>

<template>
  <div v-if="cards.length > 0">
    <CardItem
      v-for="card in cards"
      :key="card.id"
      :card="card"
      @delete="emit('deleteCard', card.id)"
      @update="(updatedCard) => emit('updateCard', card.id, updatedCard)"
    />
  </div>
  <p v-else>
    В этом модуле пока нет карточек.
  </p>
</template>
