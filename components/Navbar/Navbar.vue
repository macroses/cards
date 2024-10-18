<script lang="ts" setup>
import TheDialog from '@/components/ui/TheDialog/TheDialog.vue'

const { signOut, data } = useAuth()
const { locale, changeLanguage, initLanguage } = useChangeLanguage()

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
  <header>
    <div class="container">
      <div class="header__wrap">
        <NuxtLink to="/">
          <TheIcon
            icon-name="brain"
            width="30px"
          />
        </NuxtLink>
        <ul>
          <li>
            <NuxtLink to="/">
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/modules">
              Folders
            </NuxtLink>
          </li>
          <li>
            <TheDetails>
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
          </li>
        </ul>
      </div>
    </div>
  </header>

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
