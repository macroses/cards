<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const { data: authData } = useAuth()
const { toast } = useToast()
const emit = defineEmits(['module-created'])

const moduleName = ref('')

async function createModule() {
  if (!authData.value?.user) {
    toast({ variant: "destructive", description: 'Вы должны быть авторизованы' })
    return
  }

  if (!moduleName.value) {
    toast({ variant: "destructive", description: 'Введите название модуля' })
    return
  }

  try {
    const response = await $fetch('/api/modules/modules', {
      method: 'POST',
      body: { name: moduleName.value, userId: authData.value.user.id }
    })

    toast({
      description: 'Модуль успешно создан'
    })

    emit('module-created')

    moduleName.value = ''
    // Здесь можно добавить обновление списка модулей, если он отображается на странице
  } catch (error) {
    console.error('Ошибка при создании модуля:', error)
    toast({ variant: "destructive", description: 'Ошибка при создании модуля' })
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Создать новый модуль</h2>
    <div class="flex gap-2">
      <Input v-model="moduleName" placeholder="Название модуля" />
      <Button @click="createModule">Создать</Button>
    </div>
  </div>
</template>