import { auth } from "@/firebase/config";
import { getDocs } from "@/firebase/docs";
import { Collection, RoomField, UserField, Room } from "@/types";

export const getUserOwnedRooms = async () => {
  const snapshot = await getDocs(Collection.Rooms, [
    `${RoomField.Owner}.${UserField.Id}`,
    "==",
    auth.currentUser?.uid,
  ]);

  return snapshot.docs.map((doc) => {
    return doc.id;
  });
};

export const getUserJoinedRooms = async () => {
  const snapshot = await getDocs(Collection.Rooms, [
    `${RoomField.GuestsIds}`,
    "array-contains",
    auth.currentUser?.uid,
  ]);

  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      [RoomField.Guests]: doc.get(RoomField.Guests) as Room[RoomField.Guests],
    };
  });
};
