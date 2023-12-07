// Utilities
import { defineStore } from "pinia";
import { Dialogs } from "@/types";

export const useDialogsStore = defineStore("dialogs", {
  state: () => ({
    isOpen: {
      [Dialogs.Settings]: false,
      [Dialogs.JoinRoom]: false,
      [Dialogs.CreateRoom]: false,
    },
  }),
});
