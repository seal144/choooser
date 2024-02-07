import { defineStore } from "pinia";
import { Dialogs } from "@/types";

export const useDialogsStore = defineStore("dialogs", {
  state: () => ({
    isOpen: {
      [Dialogs.Settings]: false,
      [Dialogs.JoinRoom]: false,
      [Dialogs.CreateRoom]: false,
      [Dialogs.ConfirmDeleteAccount]: false,
      [Dialogs.ConfirmDeleteRoom]: false,
      [Dialogs.ConfirmDeleteRoomInside]: false,
      [Dialogs.ConfirmAbandonRoom]: false,
      [Dialogs.ConfirmAbandonRoomInside]: false,
      [Dialogs.ConfirmKickUser]: false,
      [Dialogs.RoomInfoLogin]: false,
      [Dialogs.RoomInfoIsFull]: false,
      [Dialogs.JoinRoomFromURL]: false,
      [Dialogs.AppInfo]: false,
    },
  }),
});
