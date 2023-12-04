<template>
  <v-app-bar>
    <v-container>
      <v-app-bar-title> <Logo :collapse="xs" /> </v-app-bar-title>
      <div class="action-container">
        <SettingsDialog />
        <Button @click="handleLogout" :icon="!smAndUp"
          ><v-icon icon="mdi-logout" /><span v-if="smAndUp"
            >logout</span
          ></Button
        >
        <!-- <Button :icon="!smAndUp"
          ><v-icon icon="mdi-login" /><span v-if="smAndUp">login</span></Button
        > -->
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
import Button from "@/components/Button.vue";
import Logo from "@/components/Logo.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
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

<style scoped lang="scss">
.v-container {
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
