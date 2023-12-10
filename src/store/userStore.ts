import { defineStore } from "pinia";
import { auth } from "@/firebase/config";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    displayName: auth.currentUser?.displayName,
  }),
});
