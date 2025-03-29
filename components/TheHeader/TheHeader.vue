<script setup lang="ts">
const localePath = useLocalePath()
const { signOut, data } = useAuth()
const { locale, changeLanguage, initLanguage } = useChangeLanguage()
const { timer, activeWorkout } = useWorkoutTimer()

function handleSignOut() {
  signOut()
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
        <div class="header__functions">
          <NuxtLink :to="localePath(`/`)">
            {{ $t('main_navigation.program') }}
          </NuxtLink>
          <NuxtLink :to="localePath(`/`)">
            {{ $t('main_navigation.body_parameters') }}
          </NuxtLink>
          <NuxtLink
            v-if="activeWorkout"
            class="header__timer"
            :to="localePath(`/workout/run/${activeWorkout.id}`)"
          >
            {{ timer }}
          </NuxtLink>
          <TheDetails
            class="header__details"
          >
            <template #summary>
              <NuxtImg
                v-if="data?.user?.image"
                :src="data.user.image"
                width="36px"
                height="36px"
                densities="x1 x2"
                class="avatar"
              />
              <div
                v-else
                class="user-avatar__placeholder"
              >
                {{ data?.user?.email?.[0] }}
              </div>
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
                    @click="handleSignOut"
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
        </div>
      </nav>
    </div>

    <!--    <TheDialog> -->
    <!--      <template #content> -->
    <!--        <div>{{ $t('signOutConfirm') }}</div> -->
    <!--      </template> -->
    <!--      <template #footer> -->
    <!--        <div class="dialog-footer"> -->
    <!--          <TheButton -->
    <!--            variant="ghost" -->
    <!--            @click="handleSignOut" -->
    <!--          > -->
    <!--            Выйти -->
    <!--          </TheButton> -->
    <!--          <TheButton> -->
    <!--            Отмена -->
    <!--          </TheButton> -->
    <!--        </div> -->
    <!--      </template> -->
    <!--    </TheDialog> -->
  </header>
</template>

<style src='./style.css' />
