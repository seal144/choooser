import { ref } from "vue";
import { doc, updateDoc } from "firebase/firestore";

import { useRoomStore } from "@/store/roomStore";
import { db } from "@/firebase/config";
import { Collection, Phase, RoomField } from "@/types";

const useConfirmOptions = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);

  const saveOptions = async (options: string[]) => {
    const { room } = useRoomStore();

    if (room) {
      const docRef = doc(db, Collection.Rooms, room.id);
      // double-check so as not to have duplicate options
      const optionsSet = [...new Set([...options])];

      await updateDoc(docRef, { [RoomField.Options]: optionsSet });
    }
  };

  const confirmOptions = async (options: string[]) => {
    const { room } = useRoomStore();

    if (room) {
      loading.value = true;
      error.value = null;

      try {
        await saveOptions(options);

        const docRef = doc(db, Collection.Rooms, room.id);
        await updateDoc(docRef, { [RoomField.Phase]: Phase.Choosing });

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
    confirmOptions,
    saveOptions,
    loading,
    error,
  };
};

export default useConfirmOptions;
