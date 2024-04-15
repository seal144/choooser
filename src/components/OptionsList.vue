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
            <ButtonIcon
              icon="mdi-arrow-up"
              size="small"
              @click="changeOptionPosition('up', option)"
            />
            <ButtonIcon
              icon="mdi-arrow-down"
              size="small"
              @click="changeOptionPosition('down', option)"
            />
            <ButtonIcon
              icon="mdi-arrow-collapse-up"
              size="small"
              @click="changeOptionPosition('top', option)"
            />
            <ButtonIcon
              icon="mdi-arrow-collapse-down"
              size="small"
              @click="changeOptionPosition('bottom', option)"
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

const getOptionIndex = (option: string) => {
  return props.options.findIndex((item) => item === option);
};

const editOptionName = (newName: string) => {
  const index = getOptionIndex(optionInEditMode.value);
  const newArray = [...props.options];
  newArray.splice(index, 1, newName);

  emit("updateOptions", newArray);
  optionInEditMode.value = "";
};

const cancelEditOptionName = () => {
  optionInEditMode.value = "";
};

const changeOptionPosition = (
  type: "up" | "down" | "top" | "bottom",
  option: string
) => {
  const optionIndex = getOptionIndex(option);
  const optionsLastIndex = props.options.length - 1;

  if (optionIndex === 0 && (type === "up" || type === "top")) return;
  if (
    optionIndex === optionsLastIndex &&
    (type === "down" || type === "bottom")
  )
    return;

  const newArray = [...props.options];

  if (type === "up") {
    newArray.splice(
      optionIndex - 1,
      2,
      newArray[optionIndex],
      newArray[optionIndex - 1]
    );
  }

  if (type === "down") {
    newArray.splice(
      optionIndex,
      2,
      newArray[optionIndex + 1],
      newArray[optionIndex]
    );
  }

  if (type === "top") {
    newArray.splice(optionIndex, 1);
    newArray.splice(0, 0, props.options[optionIndex]);
  }

  if (type === "bottom") {
    newArray.splice(optionIndex, 1);
    newArray.splice(optionsLastIndex, 0, props.options[optionIndex]);
  }

  emit("updateOptions", newArray);
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
