<template>
  <HeaderCard left class="person-card">
    <div class="card-content">
      <div><v-icon icon="mdi-account" size="20" />{{ name }}</div>
      <div class="actions">
        <v-icon v-if="check" icon="mdi-check-bold" size="20" />
        <v-progress-circular
          v-if="isPending"
          indeterminate
          size="20"
          width="2"
        ></v-progress-circular>
        <ButtonIcon
          v-if="kickButton"
          icon="mdi-shoe-formal"
          size="small"
          @click="kickCallback"
        />
      </div>
    </div>
  </HeaderCard>
</template>

<script lang="ts" setup>
import { ButtonIcon, HeaderCard } from "@/components";
import { PropType } from "vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
  kickButton: {
    type: Boolean,
    default: false,
  },
  kickCallback: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  check: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.person-card {
  padding-right: 4px;
  padding-left: 4px;
  .card-content {
    display: flex;
    justify-content: space-between;

    .actions {
      display: flex;
      gap: 0.25rem;
      justify-content: end;
      align-items: center;
    }
  }
}
</style>
