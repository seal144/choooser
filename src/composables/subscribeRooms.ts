import { ref, watchEffect } from "vue";
import { db } from "@/firebase/config";
import {
  Timestamp,
  collection,
  onSnapshot,
  query as queryFirestore,
  where,
} from "firebase/firestore";
import { Room, RoomField } from "@/types";
import getUser from "./getUser";
import useDeleteRoom from "./useDeleteRoom";

const { deleteRoom } = useDeleteRoom();

type RoomData = Omit<Room, "id">;

export enum RoomRole {
  owner,
  guest,
}

const subscribeRooms = (roomRole: RoomRole) => {
  const rooms = ref<Room[]>([]);
  const { user } = getUser();

  const collectionRef = collection(db, "rooms");

  const query =
    roomRole === RoomRole.owner
      ? queryFirestore(collectionRef, where("owner", "==", user.value?.uid))
      : queryFirestore(
          collectionRef,
          where("guests", "array-contains", user.value?.uid)
        );

  const unsubscribe = onSnapshot(query, (snapshot) => {
    //the app is filtering out and deleting rooms older than two weeks
    const filteredDocs = snapshot.docs.filter((doc) => {
      const TwoWeeksInSeconds = 60 * 60 * 24 * 14;
      const nowSeconds = Timestamp.now().seconds;
      const createTime: Room[RoomField.CreateTime] = doc.get(
        RoomField.CreateTime
      );
      if (nowSeconds - createTime.seconds > TwoWeeksInSeconds) {
        deleteRoom(doc.id);
        return false;
      }
      return true;
    });

    rooms.value = filteredDocs.map((doc) => ({
      ...(doc.data() as RoomData),
      id: doc.id,
    }));
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { rooms };
};

export default subscribeRooms;
