<template>
  <v-snackbar v-model="cookieBannerOpen" timeout="-1" rounded="0">
    <div class="cookie-banner-content">
      This web app uses cookies to ensure you get the best experience. By
      continuing to use this web app, you consent to the use of cookies.
      <Button @click="grantCookieConsent" elevation="1"> Agree </Button>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useLocalStorage } from "@vueuse/core";

import Button from "./Button.vue";

const cookieConsentGranted = useLocalStorage("cookieConsentGranted", false);

const cookieBannerOpen = ref(!cookieConsentGranted.value);

watchEffect(() => {
  if (cookieConsentGranted.value) {
    cookieBannerOpen.value = false;
  }
});

const grantCookieConsent = () => {
  cookieConsentGranted.value = true;
};
</script>

<style>
.v-snackbar__wrapper {
  border: 1px solid rgb(var(--v-theme-primary));
}

.cookie-banner-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: -0.5rem;
}
</style>
