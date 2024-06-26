<template>
  <v-navigation-drawer
    v-bind="$attrs"
    temporary
    :class="{ xxl: xxl, xs: xs }"
    :width="drawerWidth"
  >
    <div class="drawer-content">
      <div v-if="room" class="drawer-info">
        <div class="drawer-header">
          <HeaderCard class="drawer-header-text">{{ room.name }}</HeaderCard>
          <ButtonIcon icon="mdi-menu-open" @click="emit('close')" />
        </div>
        <div class="prop-container">
          <p>Created at:</p>
          <HeaderCard>{{ formattedTime }}</HeaderCard>
        </div>
        <div class="prop-container">
          <p>Status:</p>
          <HeaderCard>{{ phaseDescription }}</HeaderCard>
        </div>
        <div class="prop-container">
          <p>Host:</p>
          <PersonCard
            :name="room.owner.displayName"
            :isPending="isOwnerPending"
            :check="room.phase === Phase.Choosing && !isOwnerPending"
          />
        </div>
        <p v-if="room.guests.length">Guests:</p>
        <div class="prop-container guests-container">
          <PersonCard
            v-for="guest in room.guests"
            :key="guest.id"
            :name="guest.displayName"
            :kickButton="isOwner"
            :isPending="
              room.phase === Phase.Choosing &&
              room.participantsIdsStillChoosing.includes(guest.id)
            "
            :check="
              room.phase === Phase.Choosing &&
              !room.participantsIdsStillChoosing.includes(guest.id)
            "
            :kickCallback="
              () => {
                openKickUserDialog(guest);
              }
            "
          />
        </div>
      </div>
      <div class="drawer-actions">
        <Button
          v-if="isOwner && room?.phase !== Phase.SettingOptions"
          @click="openDialog(Dialogs.ConfirmPrevPhase)"
          class="drawer-button"
        >
          <v-icon icon="mdi-restore" size="large" />
          Go to previous phase
        </Button>
        <Button
          v-if="isOwner"
          @click="openDialog(Dialogs.ConfirmDeleteRoomInside)"
          class="drawer-button"
          danger
          ><v-icon icon="mdi-trash-can-outline" size="large" />Delete
          room</Button
        >
        <Button
          v-else
          @click="openDialog(Dialogs.ConfirmAbandonRoomInside)"
          class="drawer-button"
          ><v-icon icon="mdi-exit-run" size="large" />Abandon room</Button
        >
      </div>
    </div>
  </v-navigation-drawer>
  <ConfirmDeleteAbandonRoom
    :identification="Dialogs.ConfirmDeleteRoomInside"
    variant="delete"
    :confirm="handleDeleteRoom"
    :loading="loadingDeleteRoom"
  />
  <ConfirmDeleteAbandonRoom
    :identification="Dialogs.ConfirmAbandonRoomInside"
    variant="abandon"
    :confirm="handleAbandonRoom"
    :loading="loadingAbandonRoom"
  />
  <ConfirmDeleteAbandonRoom
    :identification="Dialogs.ConfirmKickUser"
    variant="kickUser"
    :text="
      selectedUserForAction
        ? `Do you want to kick ${selectedUserForAction.displayName} out of the room?`
        : undefined
    "
    :confirm="handleKickUser"
    :loading="loadingAbandonRoom"
    @close="onCloseKickDialog"
  />
  <ConfirmDialog
    :dialogIdentification="Dialogs.ConfirmPrevPhase"
    title="Are you sure?"
    text="Do you want to go back to the previous phase? The current state will be lost."
    confirmLabel="Go back"
    confirmIcon="mdi-restore"
    :confirmAction="handleGoToPrevPhase"
    :loading="loadingPrevPhase"
  />
  <Snackbar
    v-model="snackbarDeleteError"
    :text="`Deleting room ${CommonErrors.DefaultSuffix}`"
  />
  <Snackbar
    v-model="snackbarAbandonError"
    :text="`Abandoning room ${CommonErrors.DefaultSuffix}`"
  />
  <Snackbar
    v-model="snackbarPrevPhaseError"
    :text="`Changing phase ${CommonErrors.DefaultSuffix}`"
  />
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { format } from "date-fns";

import { useRoomStore } from "@/store/roomStore";
import { useDialogsStore } from "@/store/dialogs";
import {
  Button,
  ButtonIcon,
  ConfirmDeleteAbandonRoom,
  ConfirmDialog,
  HeaderCard,
  PersonCard,
  Snackbar,
} from "@/components";
import useDeleteRoom from "@/composables/useDeleteRoom";
import useAbandonRoom from "@/composables/useAbandonRoom";
import getUser from "@/composables/getUser";
import useGoToPrevPhase from "@/composables/useGoToPrevPhase";
import { RoutesNames } from "@/router";
import { CommonErrors, Dialogs, Phase, User } from "@/types";

const emit = defineEmits(["close"]);

const room = toRef(useRoomStore(), "room");
const { user } = getUser();
const router = useRouter();
const { xs, xxl } = useDisplay();
const dialogs = useDialogsStore();
const {
  deleteRoom,
  loading: loadingDeleteRoom,
  error: errorDeleteRoom,
} = useDeleteRoom();
const {
  abandonRoom,
  loading: loadingAbandonRoom,
  error: errorAbandonRoom,
} = useAbandonRoom();
const {
  goToPrevPhase,
  loading: loadingPrevPhase,
  error: errorPrevPhase,
} = useGoToPrevPhase();

const snackbarDeleteError = ref(false);
const snackbarAbandonError = ref(false);
const snackbarPrevPhaseError = ref(false);
const selectedUserForAction = ref<User | null>(null);

const drawerWidth = computed(() => {
  if (xxl.value) return "360";
  return "280";
});

const isOwner = room.value?.owner.id === user.value?.uid ? true : false;

const phaseDescription = computed(() => {
  switch (room.value?.phase) {
    case Phase.SettingOptions:
      return "Phase 1 - setting the options";
    case Phase.Choosing:
      return "Phase 2 - ranking the options";
    case Phase.Result:
      return "Phase 3 - result";
    default:
      return "Phase unset";
  }
});

const isOwnerPending = computed(() => {
  if (room.value?.phase === Phase.SettingOptions) {
    return true;
  }
  if (
    room.value?.phase === Phase.Choosing &&
    room.value.participantsIdsStillChoosing.includes(room.value.owner.id)
  ) {
    return true;
  }
  return false;
});

const formattedTime = room.value
  ? format(room.value.createTime.toDate(), "dd.MM.yyy | HH:mm")
  : "";

const openKickUserDialog = (guest: User) => {
  selectedUserForAction.value = guest;
  dialogs.isOpen[Dialogs.ConfirmKickUser] = true;
};

const onCloseKickDialog = () => {
  selectedUserForAction.value = null;
};

const openDialog = (dialog: Dialogs) => {
  dialogs.isOpen[dialog] = true;
};

const handleGoToPrevPhase = async () => {
  await goToPrevPhase();

  if (errorPrevPhase.value) {
    snackbarPrevPhaseError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmPrevPhase] = false;
    emit("close");
  }
};

const handleKickUser = async () => {
  if (selectedUserForAction.value && room.value) {
    await abandonRoom(room.value.id, selectedUserForAction.value.id);
    if (errorAbandonRoom.value) {
      snackbarAbandonError.value = true;
    } else {
      dialogs.isOpen[Dialogs.ConfirmKickUser] = false;
    }
  }
};
const handleDeleteRoom = async () => {
  if (room.value) {
    await deleteRoom(room.value.id);
  }
  if (errorDeleteRoom.value) {
    snackbarDeleteError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmDeleteRoomInside] = false;
    router.push({ name: RoutesNames.Home });
  }
};
const handleAbandonRoom = async () => {
  if (room.value) {
    await abandonRoom(room.value.id);
  }
  if (errorAbandonRoom.value) {
    snackbarAbandonError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmAbandonRoomInside] = false;
  }
};
</script>

<style lang="scss" scoped>
.drawer-content {
  padding: 28px 1rem 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .drawer-header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .drawer-header-text {
      flex: 1;
    }
  }

  .prop-container {
    margin-bottom: 0.5rem;
  }

  .guests-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .drawer-actions {
    margin-top: 1rem;
  }
  .drawer-button {
    width: 100%;
    margin-bottom: 1rem;
  }

  &.xxl {
    padding-left: 2rem;
  }
  &.xs {
    padding: 28px 0.5rem 12px;
  }
}
</style>
