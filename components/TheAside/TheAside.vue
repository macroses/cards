<script setup lang="ts">
const localePath = useLocalePath()
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
      <li>
        <TheButton
          v-tooltip="{ content: 'Training programs', position: 'right' }"
          variant="ghost"
          icon-only
          link
          :link-path="localePath(`/`)"
          role="menuitem"
          aria-label="Training programs"
        >
          <TheIcon
            icon-name="book-open-cover"
            width="20px"
            aria-hidden="true"
          />
        </TheButton>
      </li>
      <li>
        <TheButton
          v-tooltip="{ content: 'Body parameters', position: 'right' }"
          variant="ghost"
          icon-only
          link
          :link-path="localePath(`/`)"
          role="menuitem"
          aria-label="Body parameters"
        >
          <TheIcon
            icon-name="ruler-triangle"
            width="20px"
            aria-hidden="true"
          />
        </TheButton>
      </li>
    </ul>

    <div
      class="profile"
      role="complementary"
      aria-label="User profile"
    />
  </nav>
</template>

<style src='./style.css' />
