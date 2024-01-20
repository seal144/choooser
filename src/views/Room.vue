<template>
  <div class="room-view-container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="48"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else>
      <div>Params id {{ route.params.id }}</div>
      <div>{{ room }}</div>
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
import { computed, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

import { lineThickness } from "@/plugins/vuetify";
import { RoutesNames } from "@/router";
import { useDialogsStore } from "@/store/dialogs";
import { InfoDialog } from "@/components";
import getUser from "@/composables/getUser";
import subscribeRoom from "@/composables/subscribeRoom";
import { Dialogs } from "@/types";

const router = useRouter();
const route = useRoute();
const { user } = getUser();
const dialogs = useDialogsStore();
const { room } = subscribeRoom(route.params.id as string);

const loading = computed(() => {
  if (!user.value || !room.value) {
    return true;
  }
  return false;
});

watchEffect(() => {
  if (!user.value) {
    dialogs.isOpen[Dialogs.RoomInfoLogin] = true;
  }
});

const loginRedirect = () => {
  if (!user.value) {
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
