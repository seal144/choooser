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
        <ButtonSubMenu
          :id="room.id"
          :offset="[0, 100]"
          :actionsList="roomsSubMenu"
        />
      </Button>
      <HeaderCard v-if="guestedRooms.length">Joined Rooms</HeaderCard>
      <Button v-for="room in guestedRooms" :key="room.id">
        <v-icon icon="mdi-login" size="large" />
        {{ room.name }}
        <!-- TODO left in case that in component approach something is not working, delete it before merge -->
        <!-- <v-menu :offset="[0, 100]">
          <template v-slot:activator="{ props }">
            <v-btn
              class="button-submenu"
              variant="plain"
              icon="mdi-dots-vertical"
              density="compact"
              v-bind="props"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item>
              <Button block>
                <v-icon icon="mdi-trash-can-outline" size="large" />
                Delete
              </Button>
            </v-list-item>
          </v-list>
        </v-menu> -->
      </Button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, toRef, onBeforeUnmount } from "vue";
import { useDisplay } from "vuetify";
import Button from "@/components/Button.vue";
import JoinCreateRoomDialog from "@/components/JoinCreateRoomDialog.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import ButtonSubMenu from "@/components/ButtonSubMenu.vue";
import getOwnedRooms from "@/composables/subscribeOwnedRooms";
import getGuestRooms from "@/composables/subscribeGuestedRooms";
import { useUserStore } from "@/store/userStore";
import { lineThickness } from "@/plugins/vuetify";

const displayName = toRef(useUserStore(), "displayName");
const { ownedRooms } = getOwnedRooms();
const { guestedRooms } = getGuestRooms();
const { xs } = useDisplay();
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

const roomsSubMenu = [
  {
    label: "Delete",
    icon: "mdi-trash-can-outline",
    action: (roomId: string) => {
      console.log(roomId);
    },
  },
];
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

// TODO left in case that in component approach something is not working delete it before merge
// .button-submenu {
//   position: absolute;
//   right: 0.25rem;
// }
</style>
