<script setup lang="ts">
import { NAVIGATION_ITEMS } from '~/constants/aside-menu'

const props = defineProps({
  isChartsControlVisible: {
    type: Boolean,
    default: false,
  },
})

const localePath = useLocalePath()
const route = useRoute()

const { initLanguage } = useChangeLanguage()

const isChartsDisabled = useLocalStorage('charts-disabled', false)
const isMounted = ref(false)

async function toggleCharts() {
  await document.startViewTransition(() => {
    isChartsDisabled.value = !isChartsDisabled.value
    document.body.classList.toggle('charts-disabled')
  }).finished
}

function getVariant(path: string) {
  const currentPath = route.path
  const targetPath = localePath(path)

  if (targetPath === localePath('/')) {
    return currentPath === targetPath ? 'secondary' : 'ghost'
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`) ? 'secondary' : 'ghost'
}

const isControlChartsVisible = computed(() => {
  return route.path === localePath('/') && props.isChartsControlVisible
})

onMounted(() => {
  isMounted.value = true
  initLanguage()

  if (isChartsDisabled.value) {
    document.body.classList.add('charts-disabled')
  }
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
          :link-path="localePath(item.path)"
          role="menuitem"
          :aria-label="item.ariaLabel"
        >
          <TheIcon
            :icon-name="item.icon"
            width="20"
            aria-hidden="true"
          />
        </TheButton>
      </li>
    </ul>

    <div
      v-if="isControlChartsVisible"
      class="toggle-charts"
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
          { inactive: isMounted && isChartsDisabled },
        ]"
        @click="toggleCharts"
      >
        <TheIcon
          icon-name="chart-user"
          width="20"
          aria-hidden="true"
        />
      </TheButton>
    </div>

    <ProfilePopup />
  </nav>
</template>

<style src='./style.css' />
