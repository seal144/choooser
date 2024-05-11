import { ref, toRef } from "vue";
import { doc, updateDoc } from "firebase/firestore";

import { useRoomStore } from "@/store/roomStore";
import { db } from "@/firebase/config";
import { Collection, Phase, RoomField } from "@/types";

const useGoToPrevPhase = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const room = toRef(useRoomStore(), "room");

  const goToPrevPhase = async () => {
    if (room.value) {
      if (room.value.phase === Phase.SettingOptions) {
        return;
      }
      loading.value = true;
      error.value = null;

      try {
        const docRef = doc(db, Collection.Rooms, room.value.id);
        await updateDoc(docRef, {
          [RoomField.Phase]: room.value.phase - 1,
          [RoomField.Choices]: [],
        });

        loading.value = false;
      } catch (err) {
        const { message } = err as Error;
        console.error(message);
        loading.value = false;
        error.value = message;
      }
    }
  };

  return {
    goToPrevPhase,
    loading,
    error,
  };
};

export default useGoToPrevPhase;
