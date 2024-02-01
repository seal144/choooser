<template>
  <SideDrawer :room="room" v-model="drawer" @close="drawer = false" />
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
      <div class="chat-container">
        <Chat />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { useDisplay } from "vuetify";

import SideDrawer from "./SideDrawer.vue";
import Chat from "./Chat.vue";
import { ButtonIcon, HeaderCard } from "@/components";
import { RoomDetailsData } from "@/types";

const props = defineProps({
  room: {
    type: Object as PropType<RoomDetailsData>,
    required: true,
  },
});

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
}
</style>
