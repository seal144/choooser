import { ref } from "vue";
import { doc, updateDoc } from "firebase/firestore";

import { useRoomStore } from "@/store/roomStore";
import { db } from "@/firebase/config";
import { Collection, Phase, RoomField } from "@/types";

const useProceedToResult = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const { room } = useRoomStore();

  const proceedToResult = async () => {
    if (room) {
      loading.value = true;
      error.value = null;

      try {
        const docRef = doc(db, Collection.Rooms, room.id);
        await updateDoc(docRef, { [RoomField.Phase]: Phase.Result });

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
    proceedToResult,
    loading,
    error,
  };
};

export default useProceedToResult;
