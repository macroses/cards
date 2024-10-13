<script setup lang="ts">
import TheDialog from '@/components/ui/TheDialog/TheDialog.vue'

const { signOut } = useAuth()
const { locale, changeLanguage, initLanguage } = useChangeLanguage()

const dialogRef = ref<InstanceType<typeof TheDialog> | null>(null)

const openSignOutDialog = () => {
  dialogRef.value?.openDialog()
}

const handleSignOut = () => {
  signOut()
  dialogRef.value?.closeDialog()
}

onMounted(() => initLanguage())
</script>

<template>
  <nav>
    <ul>
      <li>
        <NuxtLink to="/">
          <Icon
            name="solar:home-2-linear"
            size="1.5rem"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/modules">
          <Icon
            name="solar:folder-with-files-line-duotone"
            size="1.5rem"
          />
        </NuxtLink>
      </li>
      <li>
        <TheButton
          :variant="locale === 'en' ? 'outline' : 'ghost'"
          @click="changeLanguage('en')"
        >
          En
        </TheButton>
      </li>
      <li>
        <TheButton
          :variant="locale === 'ru' ? 'outline' : 'ghost'"
          @click="changeLanguage('ru')"
        >
          Ru
        </TheButton>
      </li>
      <li>
        <TheButton
          variant="ghost"
          icon-only
          @click="openSignOutDialog"
        >
          <Icon
            name="solar:logout-2-linear"
            size="1.3rem"
          />
        </TheButton>
      </li>
    </ul>
  </nav>

  <TheDialog ref="dialogRef">
    <template #content>
      <div>Точно хотите выйти?</div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <TheButton
          variant="ghost"
        @click="handleSignOut"
      >
        Выйти
      </TheButton>
      <TheButton @click="dialogRef?.closeDialog()">
          Отмена
        </TheButton>
      </div>
    </template>
  </TheDialog>
</template>

<style scoped src="./style.css"/>