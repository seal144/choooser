import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Room } from "@/types";
import getUser from "./getUser";

type RoomData = Omit<Room, "id">;

const subscribeOwnedRooms = () => {
  const ownedRooms = ref<Room[]>([]);
  const { user } = getUser();

  const queryOwnedRooms = query(
    collection(db, "rooms"),
    where("owner", "==", user.value?.uid)
  );

  const unsubscribe = onSnapshot(queryOwnedRooms, (snapshot) => {
    ownedRooms.value = snapshot.docs.map((doc) => ({
      ...(doc.data() as RoomData),
      id: doc.id,
    }));
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { ownedRooms };
};

export default subscribeOwnedRooms;
