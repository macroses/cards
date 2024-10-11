<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({ auth: true})

const { toast } = useToast()

const { data } = useAuth()
const inputText = ref('')

async function saveText() {
  if (!data?.value?.user) {
    return
  }

  if (!inputText.value) {
    toast({ variant: "destructive", description: 'Введите текст' })
    return
  }
  
  try {
    await $fetch('/api/save-text', {
      method: 'POST',
      body: { text: inputText.value, userId: data.value.user?.id }
    })

    toast({
      description: 'Текст успешно сохранен'
    })

    inputText.value = ''
  } catch (error) {
    console.error('Ошибка при сохранении текста:', error)
  }
}
</script>

<template>
  <h1>Добро пожаловать домой.</h1>
<!--  {{ data?.user?.id }}-->
  <Input v-model="inputText"/>
  <Button
    variant="outline"
    @click="saveText"
  >
    Сохранить текст
  </Button>
</template>