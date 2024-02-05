<template>
  <div>
    <Button v-if="text" class="button-text" v-bind="$attrs">
      <div>
        <div>{{ text }}</div>
        <div>
          <v-icon icon="mdi-chevron-double-down" size="28" />
        </div>
      </div>
    </Button>
    <Button v-else v-bind="$attrs">
      <v-icon icon="mdi-chevron-double-down" size="28" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "./Button.vue";

defineProps({
  text: {
    type: String,
    required: false,
  },
});
</script>

<style scoped lang="scss">
.v-btn {
  padding: 0 0.25rem;
  min-width: unset;
}

.button-text {
  height: 44px;
  transform: translateY(-8px);
}
</style>
