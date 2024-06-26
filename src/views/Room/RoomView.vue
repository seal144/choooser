<template>
  <SideDrawer v-model="drawer" @close="drawer = false" />
  <div class="content-container">
    <ButtonIcon
      icon="mdi-menu-open"
      class="open-menu-button"
      :class="{ hide: drawer, lgAndUp }"
      @click="drawer = true"
      rotate
    />
    <div class="content" :class="{ mdAndDown }">
      <HeaderCard class="content-title" :class="{ xs }">{{
        room ? room.name : ""
      }}</HeaderCard>
      <div
        v-if="route.name === RoutesNames.RoomChat"
        class="chat-container"
        :class="{ xs }"
      >
        <Chat v-if="room" :roomId="room.id" />
      </div>
      <div v-else class="choosing-container">
        <PhaseView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";

import { useRoomStore } from "@/store/roomStore";
import SideDrawer from "./SideDrawer.vue";
import Chat from "./Chat.vue";
import PhaseView from "./PhaseView.vue";
import { ButtonIcon, HeaderCard } from "@/components";
import { RoutesNames } from "@/router";

const room = toRef(useRoomStore(), "room");
const route = useRoute();
const { xs, mdAndDown, lgAndUp } = useDisplay();

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
  z-index: 100;

  &.lgAndUp {
    position: sticky;
    top: 5.2rem;
  }

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

.choosing-container {
  max-width: 700px;
  margin: 0 auto;
}
</style>
