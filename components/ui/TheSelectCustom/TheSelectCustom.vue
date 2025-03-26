<script setup lang="ts">

</script>

<template>
  <select>
    <button>
      <div>
        <selectedcontent />
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="m7 10l5 5l5-5z" />
        </svg>
      </div>
    </button>
    <div>
      <option value="on">
        <div class="custom-option">
          <span class="indicator success" />
          <span class="option-text">On</span>
        </div>
      </option>
      <option value="off">
        <div class="custom-option">
          <span class="indicator danger" />
          <span class="option-text">Off</span>
        </div>
      </option>
    </div>
  </select>
</template>

<style scoped>
select {
  background: none;
  padding: 0;

  &, &::picker(select) {
    appearance: base-select;
  }

  &::picker-icon {
    display: none;
  }

  &:not(:open)::picker(select) {
    opacity: 0;
    transform: scale(.95);
  }

  &:open::picker(select) {
    opacity: 1;
    transform: scale(1);
  }

  &:open > button svg {
    transform: rotate(.5turn);
  }

  /* reset some picker styles */
  &::picker(select) {
    background: lightgray;
    border-radius: 4px;
    padding: 0;
    margin-block: 5px;

    @media (forced-colors: none) {
      border: none;
    }
  }
}

selectedcontent > * {
  transition:
    transform 1s ease,
    display 1s allow-discrete,
    opacity 1s;

  @starting-style {
    opacity: 0;
    transform: translateY(10px);
  }
  opacity: 1;
}

button {
  &:focus-visible {
    outline-offset: -3px;
  }

  &:has(selectedcontent) {
    align-items: start;
    min-inline-size: 20ch;
    flex-direction: column;
  }

  > div {
    inline-size: 100%;
    display: flex;
    justify-content: space-between;
    gap: 3px;
  }

  & svg {
    inline-size: 2ch;
    transition: transform .3s ease;
  }
}

div {
  min-inline-size: calc(anchor-size(self-inline) + 20px);
  scroll-behavior: smooth;

  & option {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-block: 2px;
    padding-inline: 3px;
    font-size: 14px;

    cursor: pointer;
    outline-offset: -1px;

    &::checkmark {
      font-weight: 500;
    }

    &:focus-visible {
      outline-offset: -1px;
    }

    &:is(:focus, :hover) {
      background: oklch(from red l c h / 25%);
      color: inherit;
    }

    &:is(:checked) {
      background: gold;
      font-weight: 500;
    }
  }
}

.indicator {
  display: inline-block;
  block-size: 10px;
  inline-size: 10px;
  border-radius: 50%;
  background: gray;

  &.success {
    background: green;
  }

  &.danger {
    background: red;
  }
}
</style>
