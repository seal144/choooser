<template>
  <p class="header">Options:</p>
  <v-card v-for="option in options" :key="option">
    <div class="card-container" :class="{ xs: xs }">
      <div class="text-container">
        <div><v-icon icon="mdi-star" size="20" /></div>
        <div>
          {{ option }}
        </div>
      </div>
      <div class="actions-wrapper">
        <ButtonIcon icon="mdi-pencil" size="small" @click="deleteOption" />
        <ButtonIcon icon="mdi-arrow-up" size="small" @click="deleteOption" />
        <ButtonIcon icon="mdi-arrow-down" size="small" @click="deleteOption" />
        <ButtonIcon
          icon="mdi-arrow-collapse-up"
          size="small"
          @click="deleteOption"
        />
        <ButtonIcon
          icon="mdi-arrow-collapse-down"
          size="small"
          @click="deleteOption"
        />
        <ButtonIcon
          icon="mdi-trash-can-outline"
          size="small"
          @click="deleteOption"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { useDisplay } from "vuetify";
import { ButtonIcon } from "@/components";

defineProps({
  options: Array as PropType<string[]>,
});

const { xs } = useDisplay();

const deleteOption = () => {
  console.log("delete");
};
</script>

<style scoped lang="scss">
.header {
  margin: 0.5rem 0;
}

.v-card {
  margin-bottom: 1rem;
}
.card-container {
  padding: 3.6px 0.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &.xs {
    flex-direction: column;
    align-items: flex-start;
  }

  .text-container {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  .actions-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-left: auto;
  }
}
</style>
