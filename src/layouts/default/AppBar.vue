<template>
  <v-app-bar>
    <v-app-bar-title> <Logo :collapse="xs" /> </v-app-bar-title>
    <div class="action-container">
      <v-btn v-if="false" :icon="!smAndUp"
        ><v-icon icon="mdi-cog" /><span v-if="smAndUp">settings</span>
      </v-btn>
      <v-btn :icon="!smAndUp"
        ><v-icon icon="mdi-logout" /><span v-if="smAndUp">logout</span></v-btn
      >
      <v-btn :icon="!smAndUp"
        ><v-icon icon="mdi-login" /><span v-if="smAndUp">login</span></v-btn
      >
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import Logo from "@/components/Logo.vue";
import { useDisplay } from "vuetify";

const { xs, smAndUp } = useDisplay();
</script>

<style scoped lang="scss">
@use "@/styles/settings.scss" as *;

.v-toolbar {
  border: $border-style;

  .action-container {
    display: flex;
    gap: 1rem;
    margin-right: 1rem;

    .v-btn {
      height: 34px;

      &--icon {
        width: 34px;
      }
    }
  }
}
</style>
