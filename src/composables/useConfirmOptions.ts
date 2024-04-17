import { doc, updateDoc } from "firebase/firestore";

import { useRoomStore } from "@/store/roomStore";
import { db } from "@/firebase/config";
import { Collection, RoomField } from "@/types";

const useConfirmOptions = () => {
  const { room } = useRoomStore();

  const saveOptions = async (options: string[]) => {
    if (room) {
      const docRef = doc(db, Collection.Rooms, room.id);
      // double-check so as not to have duplicate options
      const optionsSet = [...new Set([...options])];

      await updateDoc(docRef, { [RoomField.Options]: optionsSet });
    }
  };

  return {
    saveOptions,
  };
};

export default useConfirmOptions;
