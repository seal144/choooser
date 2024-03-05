import { ref, watchEffect } from "vue";
import { Unsubscribe, doc, getDoc, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import { useRoomStore } from "@/store/roomStore";
import { maxGuestsInRoom } from "@/utils/validation";
import {
  Collection,
  CommonErrors,
  RoomDataDB,
  RoomField,
  User,
  UserField,
} from "@/types";

const roomStore = useRoomStore();

const useSubscribeRoom = (roomId: string) => {
  const error = ref<string | null>(null);
  let unsubscribe: Unsubscribe;

  const unsubscribeRoom = () => {
    unsubscribe();
    roomStore.room = null;
  };

  const subscribeRoom = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error(CommonErrors.LoginAsAValidUser);
      }

      const docRef = doc(db, Collection.Rooms, roomId);

      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new Error(CommonErrors.TheDocumentNotFound);
      }

      const ownerId: User[UserField.Id] = snapshot.get(
        `${RoomField.Owner}.${UserField.Id}`
      );
      const guestsIds: RoomDataDB[RoomField.GuestsIds] = snapshot.get(
        RoomField.GuestsIds
      );

      const userIsParticipant =
        ownerId === auth.currentUser.uid ||
        guestsIds.includes(auth.currentUser.uid);

      if (!userIsParticipant && guestsIds.length >= maxGuestsInRoom) {
        throw new Error(CommonErrors.TheRoomIsFull);
      }

      unsubscribe = onSnapshot(docRef, async (snapshot) => {
        roomStore.room = {
          id: snapshot.id,
          createTime: snapshot.get(RoomField.CreateTime),
          parsedGroupId: snapshot.get(RoomField.GroupId) ? 1 : 0,
          name: snapshot.get(RoomField.Name),
          owner: snapshot.get(RoomField.Owner),
          guestsIds: snapshot.get(RoomField.GuestsIds),
          guests: snapshot.get(RoomField.Guests),
          pastGuests: snapshot.get(RoomField.PastGuests),
        };
      });

      watchEffect((onInvalidate) => {
        onInvalidate(() => unsubscribeRoom());
      });
    } catch (err) {
      const { message } = err as Error;
      console.error(message);
      error.value = message;
    }
  };

  return { subscribeRoom, unsubscribeRoom, error };
};

export default useSubscribeRoom;
