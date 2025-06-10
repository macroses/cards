<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import type { Languages } from '~/composables/ui/setLanguage/useChangeLanguage'

const logoutConfirmModal = useTemplateRef<typeof TheModal>('logoutConfirmModal')

const { changeLanguage, locale } = useChangeLanguage()
const { signOut } = useAuth()

const isProfilePopupVisible = shallowRef(false)
const profilePopup = useTemplateRef<HTMLDivElement>('profilePopup')

function toggleProfilePopup() {
  isProfilePopupVisible.value = !isProfilePopupVisible.value
}

onClickOutside(profilePopup, () => isProfilePopupVisible.value = false)
</script>

<template>
  <div
    ref="profilePopup"
    class="profile"
    role="complementary"
    aria-label="User profile"
  >
    <TheButton
      class="profile-button"
      variant="secondary"
      icon-only
      @click="toggleProfilePopup"
    >
      <TheIcon
        icon-name="user"
        width="16"
      />
    </TheButton>

    <div
      v-if="isProfilePopupVisible"
      class="profile-popup"
    >
      <ul class="profile-popup__list">
        <li class="profile-popup__item">
          <TheButton
            v-for="lang in ['en', 'ru', 'fr']"
            :key="lang"
            icon-only
            :variant="locale === lang ? 'secondary' : 'transparent'"
            @click="changeLanguage(lang as Languages)"
          >
            <NuxtImg
              :src="`/icons/${lang}.svg`"
              width="20"
              height="20px"
            />
          </TheButton>
        </li>
        <li>
          <TheButton
            v-tooltip="{ content: 'Logout', position: 'right' }"
            variant="danger"
            class="logout-button"
            @click="logoutConfirmModal?.openModal()"
          >
            <TheIcon
              icon-name="right-from-bracket"
              width="20"
            />
            Logout
          </TheButton>
        </li>
      </ul>

      <TheModal ref="logoutConfirmModal">
        <template #content>
          <div class="logout-modal__content">
            <TheIcon
              icon-name="light-emergency-on"
              width="32"
            />
            <p>Точно хотите выйти?</p>
          </div>
        </template>
        <template #footer>
          <div class="logout-modal__footer">
            <TheButton
              variant="secondary"
              @click="logoutConfirmModal?.closeModal()"
            >
              {{ $t('back') }}
            </TheButton>
            <TheButton
              variant="danger"
              @click="signOut"
            >
              {{ $t('signOut') }}
            </TheButton>
          </div>
        </template>
      </TheModal>
    </div>
  </div>
</template>

<style src="./style.css" />
