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
          owner: null,
          guests: [],
        };

        const ownerRef = doc(db, Collection.Users, room.value.ownerId);

        const ownerSnapshot = await getDoc(ownerRef);

        if (ownerSnapshot.exists()) {
          const unsubscribe = onSnapshot(ownerRef, (snapshot) => {
            if (room.value?.owner || room.value?.owner === null) {
              room.value.owner = {
                id: snapshot.id,
                displayName: snapshot.get("displayName"),
              };
            }
          });

          watchEffect((onInvalidate) => {
            onInvalidate(() => unsubscribe());
          });
        }

        room.value.guestsIds.forEach(async (guestId) => {
          const guestRef = doc(db, Collection.Users, guestId);

          const guestSnapshot = await getDoc(guestRef);

          if (guestSnapshot.exists()) {
            const unsubscribe = onSnapshot(guestRef, (snapshot) => {
              if (room.value?.guests) {
                const guestIndex = room.value?.guests.findIndex(
                  (guest) => guest.id === guestId
                );
                if (guestIndex > -1) {
                  room.value.guests[guestIndex] = {
                    id: snapshot.id,
                    displayName: snapshot.get("displayName"),
                  };
                } else {
                  room.value.guests.push({
                    id: snapshot.id,
                    displayName: snapshot.get("displayName"),
                  });
                }
              }
            });

            watchEffect((onInvalidate) => {
              onInvalidate(() => unsubscribe());
            });
          }

          // TODO FIX: if some user abandon the room, his data will be still in the guests array, the array should be filtered out. I didn't fix it because I am changing approach to store displayName in room doc to avoid unnecessary queries to backend for guests display names
        });
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
