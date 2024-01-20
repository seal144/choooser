import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { Room } from "@/types";
import getUser from "./getUser";

type RoomData = Omit<Room, "id">;

const subscribeRooms = (roomId: string) => {
  const room = ref<Room | null>(null);
  const { user } = getUser();

  if (!user.value) {
    return { room };
  }

  const docRef = doc(db, "rooms", roomId);

  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    room.value = {
      ...(snapshot.data() as RoomData),
      id: snapshot.id,
    };
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { room };
};

export default subscribeRooms;
