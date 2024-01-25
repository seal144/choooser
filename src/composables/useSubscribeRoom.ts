import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { CommonErrors, RoomData, RoomDetailsData, RoomField } from "@/types";
import { maxGuestsInRoom } from "@/utils/validation";
import getUser from "./getUser";
import { Collection } from "@/types";

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

      const owner: RoomData[RoomField.Owner] = snapshot.get(RoomField.Owner);
      const guests: RoomData[RoomField.Guests] = snapshot.get(RoomField.Guests);

      const userIsParticipant =
        owner === user.value.uid || guests.includes(user.value.uid);

      if (!userIsParticipant && guests.length >= maxGuestsInRoom) {
        throw new Error(CommonErrors.TheRoomIsFull);
      }

      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        room.value = {
          id: snapshot.id,
          createTime: snapshot.get(RoomField.CreateTime),
          parsedGroupId: snapshot.get(RoomField.GroupId) ? 1 : 0,
          name: snapshot.get(RoomField.Name),
          owner: snapshot.get(RoomField.Owner),
          guests: snapshot.get(RoomField.Guests),
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
