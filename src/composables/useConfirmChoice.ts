import { ref } from "vue";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { useRoomStore } from "@/store/roomStore";
import { auth, db } from "@/firebase/config";
import { Choice, Collection, RoomField } from "@/types";

const useConfirmChoice = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const { room } = useRoomStore();

  const saveChoice = async (ranking: string[], confirm?: boolean) => {
    if (room && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, Collection.Rooms, room.id);

      const roomSnapShot = await getDoc(docRef);

      if (roomSnapShot.exists()) {
        const currentChoices: Choice[] = roomSnapShot.get(RoomField.Choices);
        const currentUserChoice = currentChoices.find(
          (choice) => choice.userId === userId
        );
        const newChoice: Choice = {
          userId: userId,
          confirmed: Boolean(confirm),
          ranking: ranking,
        };

        if (currentUserChoice) {
          await updateDoc(docRef, {
            [RoomField.Choices]: arrayRemove(currentUserChoice),
          });
        }
        await updateDoc(docRef, {
          [RoomField.Choices]: arrayUnion(newChoice),
        });
      }
    }
  };

  const confirmChoice = async (ranking: string[], confirm: boolean) => {
    loading.value = true;
    error.value = null;

    try {
      await saveChoice(ranking, confirm);

      loading.value = false;
    } catch (err) {
      const { message } = err as Error;
      console.error(message);
      loading.value = false;
      error.value = message;
    }
  };

  return {
    confirmChoice,
    saveChoice,
    loading,
    error,
  };
};

export default useConfirmChoice;
