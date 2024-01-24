<template>
  <v-card class="side-button" @click="drawer = true">
    <v-icon v-if="xxl" icon="mdi-chevron-right" size="40" />
    <v-icon v-else icon="mdi-chevron-right" size="large" />
  </v-card>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    class="side-drawer"
    :class="{ xxl: xxl, xs: xs }"
    :width="drawerWidth"
  >
    <div className="drawer-header">
      <HeaderCard class="drawer-header-text">{{ room.name }}</HeaderCard>
      <Button
        icon
        density="compact"
        class="hide-drawer-button"
        @click="drawer = false"
        ><v-icon icon="mdi-chevron-left" size="large"
      /></Button>
    </div>
    Owner:
    <div class="owner-container">
      <PersonCard name="123456789012345678" />
    </div>
    Guests:
    <div class="guests-container">
      <PersonCard name="123456789012345678" />
      <PersonCard name="123456789012345678" />
      <PersonCard name="123456789012345678" />
    </div>
  </v-navigation-drawer>
  <div class="content" :class="{ xlAndUp: xlAndUp }">
    {{ props.room }}
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useDisplay } from "vuetify";

import { Button, HeaderCard, PersonCard } from "@/components";
import { RoomDetailsData } from "@/types";

const props = defineProps({
  room: {
    type: Object as PropType<RoomDetailsData>,
    required: true,
  },
});

const { xs, xlAndUp, xxl } = useDisplay();
const drawer = ref(false);
const drawerWidth = computed(() => {
  if (xxl.value) return "360";
  return "280";
});
</script>

<style lang="scss" scoped>
.content {
  padding-left: 28px;

  &.xlAndUp {
    padding-left: 0;
  }
}
.side-button {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
}

.side-drawer {
  padding: 1rem 1rem;

  .drawer-header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .drawer-header-text {
      flex: 1;
    }
  }

  .hide-drawer-button {
    height: 38px;
    width: 38px;
    &--icon {
      width: 38px;
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
    padding: 1rem 0.5rem;
  }
}
</style>
