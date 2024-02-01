<template>
  <div class="custom-textarea">
    <v-textarea
      v-bind="$attrs"
      variant="solo-filled"
      auto-grow
      rows="1"
      max-rows="5"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import "../styles/settings.scss";

.custom-textarea {
  .v-input__control {
    border: $border-style;
  }

  .v-textarea textarea.v-field__input {
    mask-image: none;
    padding: 0.6rem;
  }

  .v-text-field .v-input__details {
    padding-inline-end: 3rem;
  }
}
</style>
