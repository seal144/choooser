<template>
  <OptionCard
    v-for="({ option, points }, index) in ranking"
    :key="option"
    :ordinalNumber="index + 1"
    :big="index === 0"
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

defineProps({
  ranking: Array as PropType<ResultOption[]>,
});
</script>
