<template>
  <Button
    icon
    :class="{ rotate, small: size === 'small', medium: size === 'medium' }"
    ><v-icon :icon="icon" :size="iconSize"
  /></Button>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  rotate: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"small" | "medium">,
    default: "medium",
  },
});

const iconSize = computed(() => {
  switch (props.size) {
    case "small":
      return "small";
    default:
      return "large";
  }
});
</script>

<style lang="scss" scoped>
.v-btn {
  &.medium {
    height: 36px;
    width: 36px;
  }

  &.small {
    height: 22px;
    width: 22px;
  }
  &.rotate {
    .v-icon {
      transform: rotate(180deg);
    }
  }
}
</style>
