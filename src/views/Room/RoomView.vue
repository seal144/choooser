<template>
  <v-card class="side-button" @click="drawer = true">
    <v-icon v-if="xxl" icon="mdi-chevron-right" size="40" />
    <v-icon v-else icon="mdi-chevron-right" size="large" />
  </v-card>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    class="side-drawer"
    :class="{ xxl: xxl }"
    :width="drawerWidth"
  >
    <div className="drawer-header">
      <HeaderCard v-if="!xs" class="drawer-header-text">{{
        room.name
      }}</HeaderCard>
      <Button
        icon
        density="compact"
        class="hide-drawer-button"
        :class="{ xs: xs, smAndUp: smAndUp }"
        @click="drawer = false"
        ><v-icon icon="mdi-chevron-left" size="large"
      /></Button>
    </div>
    <v-list-item prepend-icon="mdi-account" title="Owner"></v-list-item>
    <v-list-item prepend-icon="mdi-account-group" title="Guests"></v-list-item>
  </v-navigation-drawer>
  <div class="content" :class="{ xlAndUp: xlAndUp }">
    {{ props.room }}
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useDisplay } from "vuetify";

import { Button, HeaderCard } from "@/components";
import { RoomDetailsData } from "@/types";

const props = defineProps({
  room: {
    type: Object as PropType<RoomDetailsData>,
    required: true,
  },
});

const { xs, smAndUp, xlAndUp, xxl } = useDisplay();
const drawer = ref(false);
const drawerWidth = computed(() => {
  if (xxl.value) return "340";
  if (xs.value) return "220";
  return "268";
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

    .drawer-header-text {
      flex: 1;
    }
  }

  .hide-drawer-button {
    &.smAndUp {
      height: 38px;
      width: 38px;
      &--icon {
        width: 38px;
      }
    }

    &.xs {
      margin-left: auto;
    }
  }
  &.xxl {
    padding-left: 2rem;
  }
}
</style>
