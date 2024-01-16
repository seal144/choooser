<template>
  <v-app-bar>
    <v-container class="default-app-bar">
      <v-app-bar-title> <Logo :collapse="xs" /> </v-app-bar-title>
      <div v-if="isRoom" class="action-container">
        <router-link :to="{ name: RoutesNames.Home }">
          <Button :icon="!smAndUp" v-if="!user?.isAnonymous">
            <v-icon icon="mdi-close-thick" size="large" /><span v-if="smAndUp">
              Leave
            </span>
          </Button>
        </router-link>
      </div>
      <div v-else class="action-container">
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
import { computed, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { signOut } from "firebase/auth";

import { auth } from "@/firebase/config";
import { Button, Logo, SettingsDialog } from "@/components";
import getUser from "@/composables/getUser";
import { RoutesNames } from "@/router";

const { user } = getUser();
const router = useRouter();
const route = useRoute();
const { xs, smAndUp } = useDisplay();

const isRoom = computed(() => {
  if (route.name === RoutesNames.Room) return true;
  return false;
});

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
