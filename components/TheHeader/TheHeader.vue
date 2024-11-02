<script setup lang="ts">
import TheDialog from '~/components/ui/TheDialog/TheDialog.vue'

const localePath = useLocalePath()
const { signOut, data } = useAuth()
const { locale, changeLanguage, initLanguage } = useChangeLanguage()
const { t } = useI18n()

const dialogRef = ref<InstanceType<typeof TheDialog> | null>(null)

function openSignOutDialog() {
  dialogRef.value?.openDialog()
}

function handleSignOut() {
  signOut()
  dialogRef.value?.closeDialog()
}

onMounted(() => initLanguage())
</script>

<template>
  <header class="header">
    <div class="container">
      <nav class="header__wrap">
        <NuxtLink
          :to="localePath('/')"
          class="header__logo"
        >
          <TheIcon
            icon-name="person-biking"
            width="32"
          />
        </NuxtLink>
        <TheDetails
          class="header__details"
        >
          <template #summary>
            <NuxtImg
              :src="data?.user?.image ?? ''"
              width="35px"
              height="35px"
              densities="x1 x2"
              class="avatar"
            />
          </template>
          <template #details-content>
            <ul class="header__profile">
              <li class="header__profile-lang">
                <TheButton
                  :variant="locale === 'en' ? 'outline' : 'ghost'"
                  @click="changeLanguage('en')"
                >
                  En
                </TheButton>
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
                  Logout
                </TheButton>
              </li>
            </ul>
          </template>
        </TheDetails>
      </nav>
    </div>

    <TheDialog ref="dialogRef">
      <template #content>
        <div>{{ t('signOutConfirm') }}</div>
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
  </header>
</template>

<style src='./style.css' />
