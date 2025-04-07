<template>
  <v-snackbar :timeout="4000" location="bottom right" class="snackbar">
    <v-alert
      density="compact"
      :type="type"
      :title="title ? title : defaultTitle"
      :text="text"
    ></v-alert>
  </v-snackbar>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { CommonErrors } from "@/types";

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<"error" | "success">,
    default: "error",
  },
});

const defaultTitle = props.type === "error" ? CommonErrors.Default : "Success";
</script>

<style lang="scss">
.snackbar {
  .v-snackbar__content {
    padding: 0;
  }

  .v-overlay__content {
    border-radius: 0;
  }
}
</style>
