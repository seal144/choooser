<template>
  <Button
    v-if="route.name === RoutesNames.Room && room?.phase === Phase.Result"
    :icon="!smAndUp"
    @click="openResultDetailsDialog"
  >
    <v-icon icon="mdi-format-list-bulleted" size="large" /><span v-if="smAndUp">
      Details
    </span>
  </Button>
  <router-link
    v-if="route.name === RoutesNames.Room"
    :to="{ name: RoutesNames.RoomChat }"
  >
    <Button :icon="!smAndUp">
      <v-icon icon="mdi-chat" size="large" /><span v-if="smAndUp"> Chat </span>
    </Button>
  </router-link>
  <router-link
    v-if="route.name === RoutesNames.Room"
    :to="{ name: RoutesNames.Home }"
  >
    <Button :icon="!smAndUp">
      <v-icon icon="mdi-close-thick" size="large" /><span v-if="smAndUp">
        Leave
      </span>
    </Button>
  </router-link>
  <router-link v-else :to="{ name: RoutesNames.Room }">
    <Button :icon="!smAndUp">
      <v-icon icon="mdi-logout-variant" size="large" /><span v-if="smAndUp">
        Go back
      </span>
    </Button>
  </router-link>
  <ResultDetailsDialog
    v-if="route.name === RoutesNames.Room && room?.phase === Phase.Result"
  />
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import { RoutesNames } from "@/router";
import { Button, ResultDetailsDialog } from "@/components";
import { useRoomStore } from "@/store/roomStore";
import { useDialogsStore } from "@/store/dialogs";
import { Dialogs, Phase } from "@/types";

const route = useRoute();
const { smAndUp } = useDisplay();
const room = toRef(useRoomStore(), "room");
const dialogs = useDialogsStore();

const openResultDetailsDialog = () => {
  dialogs.isOpen[Dialogs.ResultDetails] = true;
};
</script>
