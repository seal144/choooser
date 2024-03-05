<template>
  <SideDrawer v-model="drawer" @close="drawer = false" />
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
        room ? room.name : ""
      }}</HeaderCard>
      <div class="chat-container" :class="{ xs }">
        <Chat
          v-if="room"
          :roomId="room.id"
          :participantsList="[...room.guests, ...room.pastGuests, room.owner]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { useDisplay } from "vuetify";

import { useRoomStore } from "@/store/roomStore";
import SideDrawer from "./SideDrawer.vue";
import Chat from "./Chat.vue";
import { ButtonIcon, HeaderCard } from "@/components";

const room = toRef(useRoomStore(), "room");

const { xs, mdAndDown } = useDisplay();

const drawer = ref(false);
</script>

<style lang="scss" scoped>
.content-container {
  width: 100%;
}
.content {
  margin-top: -36px;
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
  z-index: 100;
  &.hide {
    transform: translateX(-600px);
  }
}

.chat-container {
  height: calc(100vh - 180px);
  min-height: 400px;

  &.xs {
    height: calc(100vh - 230px);
  }
}
</style>
