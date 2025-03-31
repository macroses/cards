<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import { NAVIGATION_ITEMS } from '~/constants/aside-menu'

const localePath = useLocalePath()
const route = useRoute()
const { signOut } = useAuth()
const { changeLanguage, initLanguage } = useChangeLanguage()
const selectId = useId()

const isChartsDisabled = useLocalStorage('charts-disabled', false)
const isMounted = ref(false)

async function toggleCharts() {
  await document.startViewTransition(() => {
    isChartsDisabled.value = !isChartsDisabled.value
  }).finished
}

function getVariant(path: string) {
  return route.path === localePath(path) ? 'secondary' : 'ghost'
}

const logoutConfirmModal = useTemplateRef<typeof TheModal>('logoutConfirmModal')

onMounted(() => {
  isMounted.value = true
  initLanguage()
})
</script>

<template>
  <nav
    class="aside-nav"
    aria-label="Main navigation"
  >
    <ul
      class="aside-nav__list"
      role="menubar"
      aria-orientation="vertical"
    >
      <li
        v-for="item in NAVIGATION_ITEMS"
        :key="item.path"
      >
        <TheButton
          v-tooltip="{ content: item.tooltip, position: 'right' }"
          :variant="getVariant(item.path)"
          icon-only
          link
          :link-path="localePath(item.path)"
          role="menuitem"
          :aria-label="item.ariaLabel"
        >
          <TheIcon
            :icon-name="item.icon"
            width="20px"
            aria-hidden="true"
          />
        </TheButton>
      </li>
    </ul>

    <ul class="aside-nav__bottom">
      <li
        v-if="route.path === localePath('/')"
        class="aside-nav__bottom-item"
      >
        <TheButton
          v-tooltip="{
            content: 'Charts visibility',
            position: 'right',
          }"
          variant="secondary"
          icon-only
          role="menuitem"
          :aria-label="isChartsDisabled ? 'Enable charts' : 'Disable charts'"
          class="aside-nav__charts-button"
          :class="[
            { disabled: isMounted && isChartsDisabled },
          ]"
          @click="toggleCharts"
        >
          <TheIcon
            icon-name="chart-user"
            width="20px"
            aria-hidden="true"
          />
        </TheButton>
      </li>
      <li class="aside-nav__bottom-item">
        <select :id="selectId">
          <button><selectedcontent /></button>
          <option @click="changeLanguage('en')">
            <NuxtImg
              src="/icons/us.svg"
              width="20px"
              height="20px"
            />
          </option>
          <option @click="changeLanguage('ru')">
            <NuxtImg
              src="/icons/ru.svg"
              width="20px"
              height="20px"
            />
          </option>
        </select>
      </li>
      <li>
        <TheButton
          v-tooltip="{ content: 'Logout', position: 'right' }"
          variant="danger"
          icon-only
          class="logout-button"
          @click="logoutConfirmModal?.openModal()"
        >
          <TheIcon
            icon-name="right-from-bracket"
            width="20px"
          />
        </TheButton>
      </li>
    </ul>

    <div
      class="profile"
      role="complementary"
      aria-label="User profile"
    />

    <TheModal
      ref="logoutConfirmModal"
    >
      <template #content>
        <div class="logout-modal__content">
          <TheIcon
            icon-name="light-emergency-on"
            width="32px"
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
  </nav>
</template>

<style src='./style.css' />
