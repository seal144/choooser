<template>
  <v-app-bar>
    <v-container>
      <v-app-bar-title> <Logo :collapse="xs" /> </v-app-bar-title>
      <div class="action-container">
        <v-btn :icon="!smAndUp"
          ><v-icon icon="mdi-cog" /><span v-if="smAndUp">settings</span>
        </v-btn>
        <v-btn @click="handleLogout" :icon="!smAndUp"
          ><v-icon icon="mdi-logout" /><span v-if="smAndUp">logout</span></v-btn
        >
        <!-- <v-btn :icon="!smAndUp"
          ><v-icon icon="mdi-login" /><span v-if="smAndUp">login</span></v-btn
        > -->
      </div>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config'
import Logo from "@/components/Logo.vue";
import getUser from "@/composables/getUser";

//TODO replace with pinia
getUser();

const { xs, smAndUp } = useDisplay();

const handleLogout = () => {
  signOut(auth);
}
</script>

<style scoped lang="scss">
.v-container{
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
