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

      const ownerId: RoomData[RoomField.OwnerId] = snapshot.get(
        RoomField.OwnerId
      );
      const guestsIds: RoomData[RoomField.GuestsIds] = snapshot.get(
        RoomField.GuestsIds
      );

      const userIsParticipant =
        ownerId === user.value.uid || guestsIds.includes(user.value.uid);

      if (!userIsParticipant && guestsIds.length >= maxGuestsInRoom) {
        throw new Error(CommonErrors.TheRoomIsFull);
      }

      const unsubscribe = onSnapshot(docRef, async (snapshot) => {
        room.value = {
          // ownerData: null,
          id: snapshot.id,
          createTime: snapshot.get(RoomField.CreateTime),
          parsedGroupId: snapshot.get(RoomField.GroupId) ? 1 : 0,
          name: snapshot.get(RoomField.Name),
          ownerId: snapshot.get(RoomField.OwnerId),
          guestsIds: snapshot.get(RoomField.GuestsIds),
        };

        // this part after refactor will be used in the future

        // const ownerRef = doc(
        //   db,
        //   Collection.Users,
        //   snapshot.get(RoomField.OwnerId)
        // );

        // const ownerSnapshot = await getDoc(ownerRef);

        // if (ownerSnapshot.exists()) {
        //   const unsubscribe = onSnapshot(ownerRef, (snapshot) => {
        //     if (room.value?.ownerData || room.value?.ownerData === null) {
        //       room.value.ownerData = {
        //         id: snapshot.id,
        //         displayName: snapshot.get("displayName"),
        //       };
        //     }
        //   });

        //   watchEffect((onInvalidate) => {
        //     onInvalidate(() => unsubscribe());
        //   });
        // }
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
