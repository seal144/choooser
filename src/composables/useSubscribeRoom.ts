import { ref, watchEffect } from "vue";
import { Unsubscribe, doc, getDoc, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import { useRoomStore } from "@/store/roomStore";
import { maxGuestsInRoom } from "@/utils/validation";
import {
  Choice,
  Collection,
  CommonErrors,
  Phase,
  RoomDataDB,
  RoomField,
  User,
  UserField,
} from "@/types";
import getParticipantsIdsStillChoosing from "@/utils/getParticipantsStillChoosing";

const roomStore = useRoomStore();

const useSubscribeRoom = (roomId: string) => {
  const error = ref<string | null>(null);
  let unsubscribe: Unsubscribe = () => {};

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
        const phase: Phase = snapshot.get(RoomField.Phase);

        const CurrentParticipants: User[] = [
          snapshot.get(RoomField.Owner),
          ...snapshot.get(RoomField.Guests),
        ];

        const choices: Choice[] = snapshot.get(RoomField.Choices);

        const ParticipantsIdsStillChoosing =
          phase === Phase.Choosing
            ? getParticipantsIdsStillChoosing(
                CurrentParticipants.map((user) => user.id),
                choices
              )
            : [];

        roomStore.room = {
          [RoomField.Id]: snapshot.id,
          [RoomField.CreateTime]: snapshot.get(RoomField.CreateTime),
          [RoomField.ParsedGroupId]: snapshot.get(RoomField.GroupId) ? 1 : 0,
          [RoomField.Name]: snapshot.get(RoomField.Name),
          [RoomField.Owner]: snapshot.get(RoomField.Owner),
          [RoomField.GuestsIds]: snapshot.get(RoomField.GuestsIds),
          [RoomField.Guests]: snapshot.get(RoomField.Guests),
          [RoomField.PastGuests]: snapshot.get(RoomField.PastGuests),
          [RoomField.Phase]: phase,
          [RoomField.Options]: snapshot.get(RoomField.Options),
          [RoomField.Choices]: choices,
          [RoomField.CurrentParticipants]: CurrentParticipants,
          [RoomField.ParticipantsIdsStillChoosing]:
            ParticipantsIdsStillChoosing,
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
