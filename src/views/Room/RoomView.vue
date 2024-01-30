<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    :class="{ xxl: xxl, xs: xs }"
    :width="drawerWidth"
  >
    <div class="drawer-content">
      <div class="drawer-info">
        <div className="drawer-header">
          <HeaderCard class="drawer-header-text">{{ room.name }}</HeaderCard>
          <ButtonIcon icon="mdi-menu-open" @click="drawer = false" />
        </div>
        <div class="prop-container">
          <p>Created at:</p>
          <HeaderCard>{{ formattedTime }}</HeaderCard>
        </div>
        <div class="prop-container">
          <p>Owner:</p>
          <PersonCard :name="room.owner.displayName" />
        </div>
        <p v-if="room.guests.length">Guests:</p>
        <div class="prop-container guests-container">
          <PersonCard
            v-for="guest in room.guests"
            :key="guest.id"
            :name="guest.displayName"
          />
        </div>
      </div>
      <div class="drawer-actions">
        <Button
          v-if="isOwner"
          @click="openConfirmDeleteDialog"
          class="drawer-button"
          danger
          ><v-icon icon="mdi-trash-can-outline" size="large" />Delete
          room</Button
        >
        <Button v-else @click="openConfirmAbandonDialog" class="drawer-button"
          ><v-icon icon="mdi-exit-run" size="large" />Abandon room</Button
        >
      </div>
    </div>
  </v-navigation-drawer>
  <div class="content-container">
    <ButtonIcon
      icon="mdi-menu-open"
      class="open-menu-button"
      :class="{ hide: drawer }"
      @click="drawer = true"
      rotate
    />
    <div class="content" :class="{ mdAndDown }">
      <HeaderCard class="content-title" :class="{ xs }">{{
        room.name
      }}</HeaderCard>
      {{ props.room }}
    </div>
  </div>
  <ConfirmDeleteAbandonRoom
    variant="delete"
    :confirm="handleDeleteRoom"
    :loading="loadingDeleteRoom"
  />
  <ConfirmDeleteAbandonRoom
    variant="abandon"
    :confirm="handleAbandonRoom"
    :loading="loadingAbandonRoom"
  />
  <Snackbar
    v-model="snackbarDeleteError"
    title="Something went wrong"
    text="Deleting room failed. Please, try again later."
  />
  <Snackbar
    v-model="snackbarAbandonError"
    title="Something went wrong"
    text="Abandoning room failed. Please, try again later."
  />
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { format } from "date-fns";

import { useDialogsStore } from "@/store/dialogs";
import {
  Button,
  ButtonIcon,
  ConfirmDeleteAbandonRoom,
  HeaderCard,
  PersonCard,
  Snackbar,
} from "@/components";
import useDeleteRoom from "@/composables/useDeleteRoom";
import useAbandonRoom from "@/composables/useAbandonRoom";
import getUser from "@/composables/getUser";
import { RoutesNames } from "@/router";
import { Dialogs, RoomDetailsData } from "@/types";

const props = defineProps({
  room: {
    type: Object as PropType<RoomDetailsData>,
    required: true,
  },
});

const { user } = getUser();
const router = useRouter();
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
const { xs, mdAndDown, xxl } = useDisplay();

const drawer = ref(false);
const snackbarDeleteError = ref(false);
const snackbarAbandonError = ref(false);

const drawerWidth = computed(() => {
  if (xxl.value) return "360";
  return "280";
});
const isOwner = computed(() => {
  if (props.room.owner.id === user.value?.uid) {
    return true;
  }
  return false;
});

const formattedTime = format(
  props.room.createTime.toDate(),
  "dd.MM.yyy | HH:mm"
);

const openConfirmDeleteDialog = () => {
  dialogs.isOpen[Dialogs.ConfirmDeleteRoom] = true;
};

const openConfirmAbandonDialog = () => {
  dialogs.isOpen[Dialogs.ConfirmAbandonRoom] = true;
};

const handleDeleteRoom = async () => {
  await deleteRoom(props.room.id);
  if (errorDeleteRoom.value) {
    snackbarDeleteError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmDeleteRoom] = false;
    router.push({ name: RoutesNames.Home });
  }
};
const handleAbandonRoom = async () => {
  await abandonRoom(props.room.id);
  if (errorAbandonRoom.value) {
    snackbarAbandonError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmAbandonRoom] = false;
  }
};
</script>

<style lang="scss" scoped>
.content-container {
  width: 100%;
}
.content {
  margin-top: -38px;
  padding: 0 3.5rem;

  .content-title {
    width: fit-content;
    padding-left: 2rem;
    padding-right: 2rem;
    margin: 0 auto 1.5rem;

    &.xs {
      margin: 0 0 1.5rem 3.1rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      width: unset;
    }
  }

  &.mdAndDown {
    padding: 0;
  }
}

.open-menu-button {
  position: sticky;
  top: 5.2rem;
  &.hide {
    transform: translateX(-600px) rotate(180deg);
  }
}

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
