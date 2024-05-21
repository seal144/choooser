<template>
  <div class="card-wrapper">
    <v-card class="order-card" v-if="ordinalNumber !== undefined">
      {{ ordinalNumber }}
    </v-card>
    <v-card class="option-card">
      <div class="card-content" :class="{ xs, 'one-column': oneColumn }">
        <div class="left-column">
          <div><v-icon icon="mdi-star" size="20" /></div>
          <slot name="leftColumn"></slot>
        </div>
        <div class="right-column">
          <slot name="rightColumn"></slot>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  ordinalNumber: {
    type: Number,
    required: false,
  },
  oneColumn: {
    type: Boolean,
    default: false,
  },
});

const { xs } = useDisplay();
</script>

<style scoped lang="scss">
.card-wrapper {
  padding-bottom: 1rem;
  display: flex;
  gap: 0.5rem;

  .order-card {
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .option-card {
    flex: 1;
  }
}

.card-content {
  padding: 3.6px 0.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &.xs {
    flex-direction: column;
    align-items: flex-start;

    &.one-column {
      flex-direction: unset;
    }
  }

  .left-column {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  .right-column {
    margin-left: auto;
  }
}
</style>
