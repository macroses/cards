import type { Card } from '~/types/Card'

export function useCards() {
  const cards = ref<Card[]>([])

  const fetchCards = async (moduleId: string) => {
    try {
      cards.value = await $fetch<Card[]>(`/api/cards/cards`, {
        query: { moduleId },
      })
    }
    catch (error: any) {
      console.error(error)
    }
  }

  const createCard = async (cardData: Partial<Card>, moduleId: string) => {
    try {
      const newCard = await $fetch('/api/cards/cards', {
        method: 'POST',
        body: { ...cardData, moduleId },
      })

      cards.value.push(newCard as Card)

      return newCard
    }
    catch (error: any) {
      console.error(error)

      return null
    }
  }

  const deleteCard = async (cardId: string) => {
    try {
      await $fetch(`/api/cards/${cardId}`, { method: 'DELETE' })

      cards.value = cards.value.filter(card => card.id !== cardId)
    }
    catch (error: any) {
      console.error(error)
    }
  }

  const updateCard = async (cardId: string, cardData: Partial<Card>) => {
    try {
      const updatedCard = await $fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        body: cardData,
      })

      const index = cards.value.findIndex(card => card.id === cardId)

      if (index !== -1) {
        cards.value[index] = updatedCard as Card
      }

      return updatedCard
    }
    catch (error: any) {
      console.error(error)

      return null
    }
  }

  return {
    cards,
    fetchCards,
    createCard,
    deleteCard,
    updateCard,
  }
}
