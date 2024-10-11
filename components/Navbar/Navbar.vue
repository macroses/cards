<script setup lang="ts">

const { signOut, status } = useAuth()
const isDesktop = useMediaQuery('(min-width: 768px)')
const isOpen = ref(false)

const isClient = ref(false);

const { locale, setLocale, t } = useI18n()

// Функция для сохранения языка в localStorage
function saveLanguage(lang: string) {
  localStorage.setItem('selectedLanguage', lang)
}

// Функция для загрузки языка из localStorage
function loadLanguage() {
  return localStorage.getItem('selectedLanguage') || 'en'
}

// Обновляем функцию смены языка
function changeLanguage(lang: string) {
  setLocale(lang)
  saveLanguage(lang)
}

onMounted(() => {
  isClient.value = true
  const savedLanguage = loadLanguage()
  setLocale(savedLanguage)
})
</script>

<template>
  <ul class="flex gap-2 items-center justify-end">
    <li>
      <Button
        :variant="locale === 'en' ? 'outline' : 'ghost'"
        size="icon"
        @click="changeLanguage('en')"
      >
        En
      </Button>
      <Button
        :variant="locale === 'ru' ? 'outline' : 'ghost'"
        size="icon"
        @click="changeLanguage('ru')"
      >
        Ru
      </Button>
    </li>
    <li>
      <NuxtLink to="/">Home</NuxtLink>
    </li>
    <li>
      <NuxtLink to="/protected">
        Protected
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/modules">
        Modules
      </NuxtLink>
    </li>
    <li v-if="isClient">
      <Dialog
        v-if="isDesktop"
        v-model:open="isOpen"
      >
        <DialogTrigger>
          <Button
            size="sm"
            variant="outline"
          >
            {{ $t('signOut') }}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ $t('signOutConfirm') }}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <DialogFooter class="">
            <Button
              size="sm"
              @click="signOut()"
            >
              {{ $t('signOut') }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer
        v-else
        v-model:open="isOpen"
      >
        <DrawerTrigger as-child>
          <Button
            size="sm"
            variant="secondary"
          >
            {{ $t('signOut') }}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader class="text-center">
            <DrawerTitle>{{ $t('signOutConfirm') }}</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <DrawerFooter class="pt-2">
            <Button
              size="sm"
              @click="signOut()"
            >
              {{ $t('signOut') }}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </li>
  </ul>
</template>