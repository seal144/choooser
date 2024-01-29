<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    class="side-drawer"
    :class="{ xxl: xxl, xs: xs }"
    :width="drawerWidth"
  >
    <div className="drawer-header">
      <HeaderCard class="drawer-header-text">{{ room.name }}</HeaderCard>
      <ButtonIcon icon="mdi-menu-open" @click="drawer = false" />
    </div>
    Owner:
    <div class="owner-container">
      <PersonCard :name="room.owner.displayName" />
    </div>
    Guests:
    <div class="guests-container">
      <PersonCard
        v-for="guest in room.guests"
        :key="guest.id"
        :name="guest.displayName"
      />
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
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useDisplay } from "vuetify";

import { ButtonIcon, HeaderCard, PersonCard } from "@/components";
import { RoomDetailsData } from "@/types";

const props = defineProps({
  room: {
    type: Object as PropType<RoomDetailsData>,
    required: true,
  },
});

const { xs, mdAndDown, xxl } = useDisplay();
const drawer = ref(false);
const drawerWidth = computed(() => {
  if (xxl.value) return "360";
  return "280";
});
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

.side-drawer {
  padding: 28px 1rem;

  .drawer-header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .drawer-header-text {
      flex: 1;
    }
  }

  .owner-container {
    margin-bottom: 0.5rem;
  }

  .guests-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &.xxl {
    padding-left: 2rem;
  }
  &.xs {
    padding: 28px 0.5rem;
  }
}
</style>
