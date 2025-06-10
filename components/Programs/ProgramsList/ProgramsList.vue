<script setup lang="ts">
import { periodizationPrograms } from '@/data/periodizationPrograms'

const localePath = useLocalePath()

function handleCardClick(path: string) {
  return navigateTo(localePath(path))
}
</script>

<template>
  <ul class="programs-list">
    <li
      v-for="program in periodizationPrograms"
      :key="program.path"
      tag="li"
      class="programs-list__item"
      @click="handleCardClick(program.path)"
    >
      <div class="programs-list__item-svg-wrap">
        <Component :is="program.component" />
      </div>

      <div class="programs-list__item-content">
        <h2 class="programs-list__item-title">
          {{ program.title }}
        </h2>

        <ul class="programs-list__thesis">
          <li
            v-for="(thesis, index) in program.theses"
            :key="index"
            class="programs-list__thesis-item"
          >
            {{ thesis }}
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style src="./style.css" />
