<script lang="ts" setup>
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
          <TheIcon
            icon-name="house"
            width="20px"
          />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/modules">
          <TheIcon
            icon-name="folders"
            width="20px"
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
          icon-only
          variant="ghost"
          @click="openSignOutDialog"
        >
          <TheIcon
            icon-name="right-from-bracket"
            width="20px"
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

<style scoped src="./style.css" />
