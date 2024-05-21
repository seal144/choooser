<template>
  <div>
    <OptionCard
      v-for="(option, index) in options"
      :key="option"
      :class="{ draggable: option !== optionInEditMode && !readOnlyMode }"
      :draggable="option !== optionInEditMode && !readOnlyMode"
      @dragstart="startDrag($event, option)"
      @drop="onDrop($event, option)"
      @dragover="
        (event) => {
          event.preventDefault();
        }
      "
      :ordinalNumber="createListMode ? undefined : index + 1"
      :oneColumn="option === optionInEditMode"
    >
      <template v-slot:leftColumn>
        <AppendTextForm
          v-if="option === optionInEditMode"
          editMode
          :defaultValue="option"
          :textList="options.filter((option) => option !== optionInEditMode)"
          :maxListLength="maxOptionsInRoom"
          :maxTextLength="maxOptionLength"
          @appendText="editOptionName"
          @cancelEdit="cancelEditOptionName"
        />
        <div v-else>
          {{ option }}
        </div>
      </template>
      <template v-slot:rightColumn>
        <div
          class="actions-wrapper"
          v-if="option !== optionInEditMode && !readOnlyMode"
        >
          <ButtonIcon
            v-if="createListMode"
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
            v-if="createListMode"
            icon="mdi-trash-can-outline"
            size="small"
            @click="deleteOption(option)"
          />
        </div>
        <div v-if="option !== optionInEditMode && readOnlyMode">
          {{ getPointsText(index, options.length) }}
        </div>
      </template>
    </OptionCard>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";

import { AppendTextForm, ButtonIcon, OptionCard } from "@/components";
import { maxOptionsInRoom, maxOptionLength } from "@/utils/validation";
import { getPointsText } from "@/utils/getPoints";

const props = defineProps({
  options: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  createListMode: {
    type: Boolean,
    default: false,
  },
  readOnlyMode: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["updateOptions"]);

const draggedOption = ref("");
const optionInEditMode = ref("");

const startDrag = (_event: DragEvent, option: string) => {
  if (props.readOnlyMode) {
    return;
  }
  draggedOption.value = option;
};

const onDrop = (_event: Event, droppedOnOption: string) => {
  if (props.readOnlyMode) {
    return;
  }
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
.draggable {
  cursor: grab;
}

.actions-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
