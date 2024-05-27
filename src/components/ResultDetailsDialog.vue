<template>
  <Dialog
    :identification="Dialogs.ResultDetails"
    title="Details of the Result"
    close-label="close"
    size="large"
    actionsWithBorder
  >
    <template v-slot:content>
      <div>RESULT DETAILS WILL BE HERE</div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "./Dialog.vue";
import { Dialogs } from "@/types";
</script>

<style scoped lang="scss"></style>
