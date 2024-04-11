<template>
  <div>
    <p class="header">Options:</p>
    <div
      v-for="option in options"
      :key="option"
      class="card-wrapper"
      draggable="true"
      @dragstart="startDrag($event, option)"
      @drop="onDrop($event, option)"
      @dragover="
        (event) => {
          event.preventDefault();
        }
      "
    >
      <v-card>
        <div class="card-content" :class="{ xs: xs }">
          <div class="text-container">
            <div><v-icon icon="mdi-star" size="20" /></div>
            <div>
              {{ option }}
            </div>
          </div>
          <div class="actions-wrapper">
            <ButtonIcon icon="mdi-pencil" size="small" @click="deleteOption" />
            <ButtonIcon
              icon="mdi-arrow-up"
              size="small"
              @click="deleteOption"
            />
            <ButtonIcon
              icon="mdi-arrow-down"
              size="small"
              @click="deleteOption"
            />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { useDisplay } from "vuetify";
import { ButtonIcon } from "@/components";

const props = defineProps({
  options: Array as PropType<string[]>,
  default: [],
});
const emit = defineEmits(["updateOptions"]);

const { xs } = useDisplay();

const draggedOption = ref("");

const startDrag = (_event: DragEvent, option: string) => {
  draggedOption.value = option;
};

const onDrop = (_event: Event, droppedOnOption: string) => {
  const newArray = [...(props.options as string[])];
  const draggedIndex = newArray.findIndex(
    (item) => item === draggedOption.value
  );
  const droppedOnIndex = newArray.findIndex((item) => item === droppedOnOption);

  newArray.splice(draggedIndex, 1);
  newArray.splice(droppedOnIndex, 0, draggedOption.value);

  emit("updateOptions", newArray);
};

const deleteOption = () => {
  console.log("delete");
};
</script>

<style scoped lang="scss">
.header {
  margin: 0.5rem 0;
}

.card-wrapper {
  padding-bottom: 1rem;
}

.card-content {
  padding: 3.6px 0.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: grab;

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
