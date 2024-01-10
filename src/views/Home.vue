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
      <HeaderCard v-if="ownedRooms.length">Owned Rooms</HeaderCard>
      <Button v-for="room in ownedRooms" :key="room.id">
        <v-icon icon="mdi-login" size="large" />
        {{ room.name }}
        <RoomButtonSubMenu
          :id="room.id"
          :name="room.name"
          :offset="[0, 100]"
          :actionsList="roomsSubMenu"
        />
      </Button>
      <HeaderCard v-if="guestedRooms.length">Joined Rooms</HeaderCard>
      <Button v-for="room in guestedRooms" :key="room.id">
        <v-icon icon="mdi-login" size="large" />
        {{ room.name }}
      </Button>
      <ConfirmDialog
        :dialogIdentification="Dialogs.ConfirmDeleteRoom"
        title="Are you sure?"
        :text="confirmDeleteRoomText"
        @close="onCloseConfirmDialog"
      >
        <template v-slot:confirmButton>
          <Button danger @click="handleDeleteRoom" :loading="loading"
            ><v-icon
              icon="mdi-exclamation-thick"
              size="large"
              v-if="smAndUp"
            />delete</Button
          >
        </template>
      </ConfirmDialog>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  reactive,
  onMounted,
  toRef,
  onBeforeUnmount,
} from "vue";
import { useDisplay } from "vuetify";
import Button from "@/components/Button.vue";
import JoinCreateRoomDialog from "@/components/JoinCreateRoomDialog.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import RoomButtonSubMenu from "@/components/RoomButtonSubMenu.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import getOwnedRooms from "@/composables/subscribeOwnedRooms";
import getGuestRooms from "@/composables/subscribeGuestedRooms";
import useDeleteRoom from "@/composables/useDeleteRoom";
import { useUserStore } from "@/store/userStore";
import { useDialogsStore } from "@/store/dialogs";
import { lineThickness } from "@/plugins/vuetify";
import { Dialogs } from "@/types";

const displayName = toRef(useUserStore(), "displayName");
const { ownedRooms } = getOwnedRooms();
const { guestedRooms } = getGuestRooms();
const { xs, smAndUp } = useDisplay();
const { deleteRoom, loading, error } = useDeleteRoom();
const dialogs = useDialogsStore();
const roomToDelete = reactive<{ id: string | null; name: string | null }>({
  id: null,
  name: null,
});
const hideLoading = ref(false);
let delayedHideLoading: NodeJS.Timeout;

onMounted(() => {
  delayedHideLoading = setTimeout(() => {
    hideLoading.value = true;
  }, 2000);
});

onBeforeUnmount(() => {
  clearTimeout(delayedHideLoading);
});

const showProgress = computed(() => {
  if (
    !ownedRooms.value.length &&
    !guestedRooms.value.length &&
    !hideLoading.value
  ) {
    return true;
  }
  return false;
});

const confirmDeleteRoomText = computed(() => {
  return `Do you want to delete "${roomToDelete.name}" room? This action is irreversible.`;
});

const onCloseConfirmDialog = () => {
  roomToDelete.id = null;
  roomToDelete.name = null;
};

const roomsSubMenu = [
  {
    label: "Delete",
    icon: "mdi-trash-can-outline",
    action: (roomId: string, roomName: string) => {
      roomToDelete.id = roomId;
      roomToDelete.name = roomName;
      dialogs.isOpen.CONFIRMDELETEROOM = true;
    },
  },
];

const handleDeleteRoom = async () => {
  if (roomToDelete.id) {
    await deleteRoom(roomToDelete.id);
  }
  if (!error.value) {
    dialogs.isOpen.CONFIRMDELETEROOM = false;
  }
};
</script>

<style lang="scss" scoped>
.home-view-container {
  min-width: 400px;
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
