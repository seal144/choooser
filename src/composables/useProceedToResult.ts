import { ref } from "vue";
import { doc, updateDoc } from "firebase/firestore";

import { useRoomStore } from "@/store/roomStore";
import { db } from "@/firebase/config";
import {
  Collection,
  Phase,
  Result,
  ResultChoice,
  ResultOption,
  RoomField,
} from "@/types";
import getResultRanking from "@/utils/getResultRanking";

const useProceedToResult = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);

  const proceedToResult = async () => {
    const { room } = useRoomStore();

    if (room) {
      loading.value = true;
      error.value = null;

      try {
        const docRef = doc(db, Collection.Rooms, room.id);
        const resultChoices: ResultChoice[] = [];

        room.choices.forEach((choice) => {
          if (choice.confirmed) {
            resultChoices.push({
              userId: choice.userId,
              ranking: choice.ranking,
            });
          }
        });

        const resultRanking: ResultOption[] = getResultRanking(
          room.options,
          resultChoices.map((choice) => choice.ranking)
        );

        const result: Result = {
          ranking: resultRanking,
          confirmedChoices: resultChoices,
        };

        await updateDoc(docRef, {
          [RoomField.Phase]: Phase.Result,
          [RoomField.Result]: result,
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
    proceedToResult,
    loading,
    error,
  };
};

export default useProceedToResult;
