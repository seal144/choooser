<template>
  <div class="fill-height home-view-container" :class="{ xs: xs }">
    <HeaderCard
      >&#128075; Hello {{ displayName ? displayName : "Traveler" }}</HeaderCard
    >
    <v-progress-circular
      v-if="showProgress"
      indeterminate
      size="36"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else>
      <JoinCreateRoomDialog variant="join" />
      <JoinCreateRoomDialog variant="create" />
      <HeaderCard
        v-if="
          ownedRooms && !ownedRooms.length && joinedRooms && !joinedRooms.length
        "
      >
        &#128558; You are not participating in any room. Create or join a room
        to collaborate with your friends.
      </HeaderCard>
      <HeaderCard v-if="ownedRooms && ownedRooms.length"
        >Owned Rooms</HeaderCard
      >
      <Button
        v-for="room in ownedRooms"
        :key="room.id"
        @click="enterRoom(room.id)"
      >
        <v-icon icon="mdi-login" size="large" />
        {{ room.name }}
        <RoomButtonSubMenu
          :id="room.id"
          :name="room.name"
          :offset="[0, 100]"
          :actionsList="ownedRoomsSubMenu"
        />
      </Button>
      <HeaderCard v-if="joinedRooms && joinedRooms.length"
        >Joined Rooms</HeaderCard
      >
      <Button
        v-for="room in joinedRooms"
        :key="room.id"
        @click="enterRoom(room.id)"
      >
        <v-icon icon="mdi-login" size="large" />
        {{ room.name }}
        <RoomButtonSubMenu
          :id="room.id"
          :name="room.name"
          :offset="[0, 108]"
          :actionsList="joinedRoomsSubMenu"
        />
      </Button>
      <ConfirmDeleteAbandonRoom
        variant="delete"
        :identification="Dialogs.ConfirmDeleteRoom"
        :text="confirmDeleteRoomText"
        :confirm="handleDeleteRoom"
        :loading="loadingDeleteRoom"
        @close="onCloseConfirmDialog"
      />
      <ConfirmDeleteAbandonRoom
        :identification="Dialogs.ConfirmAbandonRoom"
        variant="abandon"
        :text="confirmAbandonRoomText"
        :confirm="handleAbandonRoom"
        :loading="loadingAbandonRoom"
        @close="onCloseConfirmDialog"
      />
      <Snackbar
        v-model="snackbarDeleteError"
        :text="`Deleting room ${CommonErrors.DefaultSuffix}`"
      />
      <Snackbar
        v-model="snackbarAbandonError"
        :text="`Abandoning room ${CommonErrors.DefaultSuffix}`"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, toRef } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import {
  Button,
  ConfirmDeleteAbandonRoom,
  JoinCreateRoomDialog,
  HeaderCard,
  RoomButtonSubMenu,
  Snackbar,
} from "@/components";
import subscribeRooms from "@/composables/subscribeRooms";
import useDeleteRoom from "@/composables/useDeleteRoom";
import useAbandonRoom from "@/composables/useAbandonRoom";
import { useUserStore } from "@/store/userStore";
import { useDialogsStore } from "@/store/dialogs";
import { lineThickness } from "@/plugins/vuetify";
import { Dialogs, RoomRole, CommonErrors } from "@/types";

const displayName = toRef(useUserStore(), "displayName");
const { rooms: ownedRooms } = subscribeRooms(RoomRole.Owner);
const { rooms: joinedRooms } = subscribeRooms(RoomRole.Guest);
const router = useRouter();
const { xs } = useDisplay();
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
const dialogs = useDialogsStore();
const selectedRoomForAction = reactive<{
  id: string | null;
  name: string | null;
}>({
  id: null,
  name: null,
});

const snackbarDeleteError = ref(false);
const snackbarAbandonError = ref(false);

const showProgress = computed(() => {
  if (!ownedRooms.value || !joinedRooms.value) {
    return true;
  }
  return false;
});

const confirmDeleteRoomText = computed(() => {
  return `Do you want to delete "${selectedRoomForAction.name}" room? This action is irreversible.`;
});
const confirmAbandonRoomText = computed(() => {
  return `Do you want to abandon "${selectedRoomForAction.name}" room?`;
});

const onCloseConfirmDialog = () => {
  selectedRoomForAction.id = null;
  selectedRoomForAction.name = null;
};

const ownedRoomsSubMenu = [
  {
    label: "Delete",
    icon: "mdi-trash-can-outline",
    action: (roomId: string, roomName: string) => {
      selectedRoomForAction.id = roomId;
      selectedRoomForAction.name = roomName;
      dialogs.isOpen[Dialogs.ConfirmDeleteRoom] = true;
    },
    danger: true,
  },
];
const joinedRoomsSubMenu = [
  {
    label: "Abandon",
    icon: "mdi-exit-run",
    action: (roomId: string, roomName: string) => {
      selectedRoomForAction.id = roomId;
      selectedRoomForAction.name = roomName;
      dialogs.isOpen[Dialogs.ConfirmAbandonRoom] = true;
    },
  },
];

const handleDeleteRoom = async () => {
  if (selectedRoomForAction.id) {
    await deleteRoom(selectedRoomForAction.id);
  }
  if (errorDeleteRoom.value) {
    snackbarDeleteError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmDeleteRoom] = false;
  }
};

const handleAbandonRoom = async () => {
  if (selectedRoomForAction.id) {
    await abandonRoom(selectedRoomForAction.id);
  }
  if (errorAbandonRoom.value) {
    snackbarAbandonError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmAbandonRoom] = false;
  }
};

const enterRoom = (roomId: string) => {
  router.push(`/room/${roomId}`);
};
</script>

<style lang="scss" scoped>
.home-view-container {
  width: 400px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  &.xs {
    min-width: unset;
    width: 100%;
  }

  .v-progress-circular {
    margin: 0 auto;
  }
}
</style>
