<template>
  <div class="room-view-container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      :size="defaultCircularProgressSize"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else-if="error === CommonErrors.TheDocumentNotFound">
      <RoomNotExist />
    </template>
    <template v-else>
      <RoomView v-if="room" />
    </template>
    <ConfirmDialog
      @close="redirectLoginDialog"
      :dialogIdentification="Dialogs.RoomInfoLogin"
      title="Please log in"
      text="To participate in the room you have to log in or continue with guest account."
      confirmLabel="guest account"
      closeLabel="log in"
      :confirmAction="openSetDisplayNameDialog"
    />
    <SetDisplayNameDialog :submit-callback="onAnonymousLogin" />
    <InfoDialog
      @close="redirectHomeDialog"
      :dialogIdentification="Dialogs.RoomInfoIsFull"
      title="&#128532; The room is Full"
      :text="`there is already ${maxGuestsInRoom} guests in the room`"
      closeLabel="go Home"
    />
    <JoinCreateRoomDialog
      @close="onCloseJoinRoomDialog"
      v-if="room"
      variant="joinFromUrl"
      :roomName="room.name"
    />
    <Snackbar
      v-model="snackbarJoinRoomError"
      :text="`Joining room ${CommonErrors.DefaultSuffix}`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watchEffect, ref, toRef } from "vue";
import { useRouter, useRoute } from "vue-router";

import { defaultCircularProgressSize, lineThickness } from "@/plugins/vuetify";
import { RoutesNames } from "@/router";
import { useRoomStore } from "@/store/roomStore";
import { useDialogsStore } from "@/store/dialogs";
import {
  ConfirmDialog,
  InfoDialog,
  JoinCreateRoomDialog,
  Snackbar,
  SetDisplayNameDialog,
} from "@/components";
import RoomView from "./RoomView.vue";
import getUser from "@/composables/getUser";
import useSubscribeRoom from "@/composables/useSubscribeRoom";
import useJoinRoom from "@/composables/useJoinRoom";
import { maxGuestsInRoom } from "@/utils/validation";
import { CommonErrors, Dialogs } from "@/types";

import RoomNotExist from "./RoomNotExist.vue";

const router = useRouter();
const route = useRoute();
const { user } = getUser();
const dialogs = useDialogsStore();
const userInitValidation = ref(true);
const snackbarJoinRoomError = ref(false);
const { subscribeRoom, unsubscribeRoom, error } = useSubscribeRoom(
  route.params.id as string
);
const room = toRef(useRoomStore(), "room");
const { joinRoom, error: errorJoinRoom } = useJoinRoom();

let delayedKick: NodeJS.Timeout;

watchEffect(() => {
  if (errorJoinRoom.value && room.value && room.value.parsedGroupId === 0) {
    snackbarJoinRoomError.value = true;
    delayedKick = setTimeout(() => {
      userInitValidation.value = false;
    }, 4000);
  }
});

//has to be onUnmounted because in child components there are onBeforeUnmount which are using room store data
onUnmounted(() => {
  clearTimeout(delayedKick);
  unsubscribeRoom();
});

watchEffect(() => {
  if (!user.value) {
    dialogs.isOpen[Dialogs.RoomInfoLogin] = true;
  } else {
    // do not subscribe if SetDisplayName is open because it has to happen after setting display name on logging (onAnonymousLogin)
    if (!dialogs.isOpen[Dialogs.SetDisplayName]) {
      subscribeRoom();
    }
  }
});

const userIsParticipant = computed(() => {
  if (
    user.value &&
    room.value &&
    // next line is needed to avoid console error on deleting room from inside the room
    room.value.guestsIds &&
    (room.value.guestsIds.includes(user.value.uid) ||
      room.value.owner.id === user.value.uid)
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

const onAnonymousLogin = () => {
  dialogs.isOpen[Dialogs.RoomInfoLogin] = false;

  subscribeRoom();
};

const goHome = () => {
  router.push({ name: RoutesNames.Home });
};

const openSetDisplayNameDialog = () => {
  dialogs.isOpen[Dialogs.SetDisplayName] = true;
};

const redirectLoginDialog = () => {
  if (!user.value) {
    // TODO - use the redirect param to join the room right away
    router.push({
      name: RoutesNames.Login,
      query: { redirect: router.currentRoute.value.params.id },
    });
  }
};

const redirectHomeDialog = () => {
  if (!userInitValidation.value && !userIsParticipant.value) {
    goHome();
  }
};

const onCloseJoinRoomDialog = () => {
  if (room.value && room.value.parsedGroupId === 1) {
    userInitValidation.value = false;
  }
};

watchEffect(() => {
  if (userInitValidation.value && !userIsParticipant.value) {
    if (error.value === CommonErrors.TheRoomIsFull) {
      userInitValidation.value = false;
      dialogs.isOpen[Dialogs.RoomInfoIsFull] = true;
    }
    if (room.value && room.value.parsedGroupId === 1) {
      dialogs.isOpen[Dialogs.JoinRoomFromURL] = true;
    }
    if (room.value && room.value.parsedGroupId === 0) {
      joinRoom({ name: room.value.name, password: "" });
    }
  } else if (!userIsParticipant.value) {
    goHome();
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

<!-- handled on url join: -->
<!-- bad url -->
<!-- non logged user -->
<!-- fullRoom -->
<!-- user isn't participant password -->
<!-- user isn't participant no password -->
