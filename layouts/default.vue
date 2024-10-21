<template>
  <Navbar />
  <main>
    <div class="container">
      <slot />
    </div>
  </main>
</template>

<style>
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding-inline: 16px;
}
</style>
