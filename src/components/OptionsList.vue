<template>
  <div>
    <p class="header">Options:</p>
    <div
      v-for="option in options"
      :key="option"
      class="card-wrapper"
      :class="{ draggable: option !== optionInEditMode }"
      :draggable="option !== optionInEditMode"
      @dragstart="startDrag($event, option)"
      @drop="onDrop($event, option)"
      @dragover="
        (event) => {
          event.preventDefault();
        }
      "
    >
      <v-card>
        <div
          class="card-content"
          :class="{ xs: xs, editMode: option === optionInEditMode }"
        >
          <div class="text-container">
            <div><v-icon icon="mdi-star" size="20" /></div>
            <AppendTextForm
              v-if="option === optionInEditMode"
              editMode
              :defaultValue="option"
              :textList="
                options.filter((option) => option !== optionInEditMode)
              "
              :maxListLength="maxOptionsInRoom"
              :maxTextLength="maxOptionLength"
              @appendText="editOptionName"
              @cancelEdit="cancelEditOptionName"
            />
            <div v-else>
              {{ option }}
            </div>
          </div>
          <div class="actions-wrapper" v-if="option !== optionInEditMode">
            <ButtonIcon
              icon="mdi-pencil"
              size="small"
              @click="setOptionInEditMode(option)"
            />
            <ButtonIcon icon="mdi-arrow-up" size="small" @click="() => {}" />
            <ButtonIcon icon="mdi-arrow-down" size="small" @click="() => {}" />
            <ButtonIcon
              icon="mdi-arrow-collapse-up"
              size="small"
              @click="() => {}"
            />
            <ButtonIcon
              icon="mdi-arrow-collapse-down"
              size="small"
              @click="() => {}"
            />
            <ButtonIcon
              icon="mdi-trash-can-outline"
              size="small"
              @click="deleteOption(option)"
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

import { AppendTextForm, ButtonIcon } from "@/components";
import { maxOptionsInRoom, maxOptionLength } from "@/utils/validation";

const props = defineProps({
  options: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
const emit = defineEmits(["updateOptions"]);

const { xs } = useDisplay();

const draggedOption = ref("");
const optionInEditMode = ref("");

const startDrag = (_event: DragEvent, option: string) => {
  draggedOption.value = option;
};

const onDrop = (_event: Event, droppedOnOption: string) => {
  const newArray = [...props.options];
  const draggedIndex = newArray.findIndex(
    (item) => item === draggedOption.value
  );
  const droppedOnIndex = newArray.findIndex((item) => item === droppedOnOption);

  newArray.splice(draggedIndex, 1);
  newArray.splice(droppedOnIndex, 0, draggedOption.value);

  emit("updateOptions", newArray);
};

const setOptionInEditMode = (option: string) => {
  optionInEditMode.value = option;
};

const editOptionName = (newName: string) => {
  const index = props.options.findIndex(
    (option) => option === optionInEditMode.value
  );
  const newArray = [...props.options];
  newArray.splice(index, 1, newName);

  emit("updateOptions", newArray);
  optionInEditMode.value = "";
};

const cancelEditOptionName = () => {
  optionInEditMode.value = "";
};

const deleteOption = (deletedOption: string) => {
  const newArray = [...props.options].filter(
    (option) => option !== deletedOption
  );

  emit("updateOptions", newArray);
};
</script>

<style scoped lang="scss">
.header {
  margin: 0.5rem 0;
}

.card-wrapper {
  padding-bottom: 1rem;

  &.draggable {
    cursor: grab;
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

    &.editMode {
      flex-direction: unset;
    }
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
