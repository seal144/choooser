<template>
  <div class="room-view-container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="48"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else-if="error === CommonErrors.TheDocumentNotFound">
      <RoomNotExist />
    </template>
    <template v-else>
      <div>Params id {{ route.params.id }}</div>
      <div>{{ room }}</div>
    </template>
    <InfoDialog
      @close="redirectLoginDialog"
      :dialogIdentification="Dialogs.RoomInfoLogin"
      title="Please log in"
      text="To participate in a room you have to log in."
      closeLabel="log in"
    />
    <InfoDialog
      @close="redirectHomeDialog"
      :dialogIdentification="Dialogs.RoomInfoIsFull"
      title="&#128532; The room is Full"
      :text="`there is already ${MaxGuestsInRoom} guests in the room`"
      closeLabel="go Home"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { lineThickness } from "@/plugins/vuetify";
import { RoutesNames } from "@/router";
import { useDialogsStore } from "@/store/dialogs";
import { InfoDialog } from "@/components";
import getUser from "@/composables/getUser";
import useSubscribeRoom from "@/composables/useSubscribeRoom";
import { MaxGuestsInRoom } from "@/utils/validation";
import { CommonErrors, Dialogs } from "@/types";

import RoomNotExist from "./RoomNotExist.vue";

const router = useRouter();
const route = useRoute();
const { user } = getUser();
const dialogs = useDialogsStore();
const userInitValidation = ref(true);
const { room, subscribeRoom, error } = useSubscribeRoom(
  route.params.id as string
);

watchEffect(() => {
  if (!user.value) {
    dialogs.isOpen[Dialogs.RoomInfoLogin] = true;
  } else {
    subscribeRoom();
  }
});
// TODO check, if it is possible to take it from useSubscribeRoom, after joining implementation
const userIsParticipant = computed(() => {
  if (
    user.value &&
    room.value &&
    (room.value.guests.includes(user.value.uid) ||
      room.value.owner === user.value.uid)
  ) {
    return true;
  }
  return false;
});

const loading = computed(() => {
  if (error.value === CommonErrors.TheDocumentNotFound) {
    return false;
  } else if (!user.value || !room.value || !userIsParticipant.value) {
    return true;
  }
  return false;
});

const redirectLoginDialog = () => {
  if (!user.value) {
    router.push({ name: RoutesNames.Login });
  }
};
const redirectHomeDialog = () => {
  if (!userInitValidation.value && !userIsParticipant.value) {
    router.push({ name: RoutesNames.Home });
  }
};

// initial Validation watchEffect
watchEffect(() => {
  if (!userIsParticipant.value && userInitValidation.value) {
    if (error.value === CommonErrors.TheRoomIsFull) {
      userInitValidation.value = false;
      dialogs.isOpen[Dialogs.RoomInfoIsFull] = true;
    }
    // TODO show give password modal
  } else if (!userIsParticipant.value) {
    router.push({ name: RoutesNames.Home });
  } else {
    userInitValidation.value = false;
  }
});
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

<!-- handle init: -->
<!-- v bad url -->
<!-- v non logged user -->
<!-- v fullRoom -->
<!-- user isn't participant -->
