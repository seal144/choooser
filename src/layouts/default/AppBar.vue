<template>
  <v-app-bar>
    <v-container class="default-app-bar">
      <v-app-bar-title> <Logo :collapse="xs" /> </v-app-bar-title>
      <div class="action-container">
        <SettingsDialog />
        <Button @click="handleLogout" :icon="!smAndUp" v-if="!user?.isAnonymous"
          ><v-icon icon="mdi-logout" size="large" /><span v-if="smAndUp"
            >logout</span
          ></Button
        >
      </div>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { signOut } from "firebase/auth";

import { auth } from "@/firebase/config";
import { Button, Logo, SettingsDialog } from "@/components";
import getUser from "@/composables/getUser";

const { user } = getUser();
const router = useRouter();
const { xs, smAndUp } = useDisplay();

watchEffect(() => {
  if (!user.value) {
    router.push({ name: "Login" });
  }
});

const handleLogout = () => {
  signOut(auth);
};
</script>

<style lang="scss">
.v-container.default-app-bar {
  display: flex;

  .action-container {
    display: flex;
    gap: 1rem;

    .v-btn {
      height: 34px;
      &--icon {
        width: 34px;
      }
    }
  }
}
</style>
