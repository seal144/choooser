<template>
  <v-snackbar :timeout="3000" location="bottom right" class="snackbar">
    <v-alert
      density="compact"
      type="error"
      :title="title"
      :text="text"
    ></v-alert>
  </v-snackbar>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Something went wrong",
  },
  text: {
    type: String,
    required: true,
  },
});
</script>
<style lang="scss">
.snackbar {
  .v-snackbar__content {
    padding: 0;
  }
}
</style>
