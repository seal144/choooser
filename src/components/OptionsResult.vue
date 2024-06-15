<template>
  <OptionCard
    v-for="({ option, points }, index) in ranking"
    :key="option"
    :ordinalNumber="ordinalNumbersMap[index]"
    :big="ordinalNumbersMap[index] === 1"
  >
    <template v-slot:leftColumn>
      {{ option }}
    </template>
    <template v-slot:rightColumn>
      {{ points }} {{ points === 1 ? "point" : "points" }}
    </template>
  </OptionCard>
</template>

<script setup lang="ts">
import { PropType } from "vue";

import { OptionCard } from "@/components";
import { ResultOption } from "@/types";

const props = defineProps({
  ranking: {
    type: Array as PropType<ResultOption[]>,
    required: true,
  },
});

const ordinalNumbersMap: number[] = [];

props.ranking.forEach(({ points }, index, array) => {
  if (index === 0) {
    return ordinalNumbersMap.push(1);
  }
  if (points === array[index - 1].points) {
    return ordinalNumbersMap.push(ordinalNumbersMap[index - 1]);
  }
  return ordinalNumbersMap.push(ordinalNumbersMap[index - 1] + 1);
});
</script>
