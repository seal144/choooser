<template>
  <v-snackbar
    class="cookie-banner"
    v-model="cookieBannerOpen"
    timeout="-1"
    rounded="0"
  >
    <div class="cookie-banner-content">
      <div>
        This web app uses cookies to ensure you get the best experience. By
        continuing to use this web app, you consent to the use of cookies.
      </div>
      <Button
        class="confirm-button"
        size="small"
        @click="grantCookieConsent"
        elevation="1"
      >
        Agree
      </Button>
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

<style lang="scss">
div.v-snackbar__wrapper {
  border: 1px solid rgb(var(--v-theme-primary));
  min-width: 250px;
}

.cookie-banner-content {
  display: flex;
  flex-direction: column;

  .confirm-button {
    width: fit-content;
    margin-left: auto;
  }
}
</style>
