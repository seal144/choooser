import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Room } from "@/types";
import getUser from "./getUser";

type RoomData = Omit<Room, "id">;

const subscribeGuestedRooms = () => {
  const guestedRooms = ref<Room[]>([]);
  const { user } = getUser();

  const queryGuestedRooms = query(
    collection(db, "rooms"),
    where("guests", "array-contains", user.value?.uid)
  );

  const unsubscribe = onSnapshot(queryGuestedRooms, (snapshot) => {
    guestedRooms.value = snapshot.docs.map((doc) => ({
      ...(doc.data() as RoomData),
      id: doc.id,
    }));
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { guestedRooms };
};

export default subscribeGuestedRooms;
