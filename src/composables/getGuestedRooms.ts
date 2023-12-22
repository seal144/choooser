import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Room } from "@/types";
import getUser from "./getUser";

type DocData = Omit<Room, "id">;

const getGuestRooms = () => {
  const guestRooms = ref<Room[]>([]);
  const { user } = getUser();

  const q = query(
    collection(db, "rooms"),
    where("guests", "array-contains", user.value?.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    guestRooms.value = snapshot.docs.map((doc) => ({
      ...(doc.data() as DocData),
      id: doc.id,
    }));
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { guestRooms };
};

export default getGuestRooms;
