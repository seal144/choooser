import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { RoomDetailsData, RoomField } from "@/types";
import getUser from "./getUser";

const subscribeRooms = (roomId: string) => {
  const room = ref<RoomDetailsData | null>(null);
  const { user } = getUser();

  if (!user.value) {
    return { room };
  }

  const docRef = doc(db, "rooms", roomId);

  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    room.value = {
      id: snapshot.id,
      name: snapshot.get(RoomField.Name),
      owner: snapshot.get(RoomField.Owner),
      guests: snapshot.get(RoomField.Guests),
      createTime: snapshot.get(RoomField.CreateTime),
    };
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { room };
};

export default subscribeRooms;
