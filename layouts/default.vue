<template>
  <div class="wrapper">
    <Navbar />
    <div class="content">
      <div class="container">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.wrapper {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100dvh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
</style>
