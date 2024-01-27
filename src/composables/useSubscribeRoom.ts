import { ref, watchEffect } from "vue";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase/config";
import { maxGuestsInRoom } from "@/utils/validation";
import getUser from "./getUser";
import {
  Collection,
  CommonErrors,
  RoomDataDB,
  RoomDetailsData,
  RoomField,
} from "@/types";

const useSubscribeRoom = (roomId: string) => {
  const room = ref<RoomDetailsData | null>(null);
  const error = ref<string | null>(null);

  const subscribeRoom = async () => {
    try {
      const { user } = getUser();
      if (!user.value) {
        throw new Error(CommonErrors.LoginAsAValidUser);
      }

      const docRef = doc(db, Collection.Rooms, roomId);

      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new Error(CommonErrors.TheDocumentNotFound);
      }

      const ownerId: RoomDataDB[RoomField.OwnerId] = snapshot.get(
        RoomField.OwnerId
      );
      const guestsIds: RoomDataDB[RoomField.GuestsIds] = snapshot.get(
        RoomField.GuestsIds
      );

      const userIsParticipant =
        ownerId === user.value.uid || guestsIds.includes(user.value.uid);

      if (!userIsParticipant && guestsIds.length >= maxGuestsInRoom) {
        throw new Error(CommonErrors.TheRoomIsFull);
      }

      const unsubscribe = onSnapshot(docRef, async (snapshot) => {
        room.value = {
          id: snapshot.id,
          createTime: snapshot.get(RoomField.CreateTime),
          parsedGroupId: snapshot.get(RoomField.GroupId) ? 1 : 0,
          name: snapshot.get(RoomField.Name),
          ownerId: snapshot.get(RoomField.OwnerId),
          guestsIds: snapshot.get(RoomField.GuestsIds),
        };
      });

      watchEffect((onInvalidate) => {
        onInvalidate(() => unsubscribe());
      });
    } catch (err) {
      const { message } = err as Error;
      console.error(message);
      error.value = message;
    }
  };
  return { room, subscribeRoom, error };
};

export default useSubscribeRoom;
