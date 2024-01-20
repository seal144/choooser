<template>
  <div class="room-view-container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="48"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else>
      <div>Room {{ route.params.id }}</div>
    </template>
    <InfoDialog
      @close="loginRedirect"
      :dialogIdentification="Dialogs.RoomInfoLogin"
      title="Please log in"
      text="To participate in a room you have to log in."
      closeLabel="log in"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { lineThickness } from "@/plugins/vuetify";
import { RoutesNames } from "@/router";
import { useDialogsStore } from "@/store/dialogs";
import { InfoDialog } from "@/components";
import getUser from "@/composables/getUser";
import { Dialogs } from "@/types";

const router = useRouter();
const route = useRoute();
const { user } = getUser();
const dialogs = useDialogsStore();
const loading = ref(true);
watchEffect(() => {
  if (!user.value) {
    dialogs.isOpen[Dialogs.RoomInfoLogin] = true;
  }
});
const authenticated = computed(() => {
  if (!user.value) {
    return false;
  }
  return true;
});

const loginRedirect = () => {
  if (!authenticated.value) {
    router.push({ name: RoutesNames.Login });
  }
};
</script>

<style lang="scss" scoped>
.room-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-progress-circular {
    margin-top: 2rem;
  }
}
</style>
