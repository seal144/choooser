<template>
  <HeaderCard left class="person-card">
    <div class="card-content">
      <div><v-icon icon="mdi-account" size="20" />{{ name }}</div>
      <div v-if="kickButton">
        <ButtonIcon icon="mdi-shoe-formal" size="small" @click="kickCallback" />
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
});
</script>

<style scoped lang="scss">
.person-card {
  padding-right: 4px;
  .card-content {
    display: flex;
    justify-content: space-between;
  }
}
</style>
