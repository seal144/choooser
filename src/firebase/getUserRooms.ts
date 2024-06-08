import { auth } from "@/firebase/config";
import { getDocs } from "@/firebase/docs";
import { Collection, RoomField, UserField, Room } from "@/types";

export const getUserOwnedRooms = async (userId?: string) => {
  const snapshot = await getDocs(Collection.Rooms, [
    `${RoomField.Owner}.${UserField.Id}`,
    "==",
    userId ? userId : auth.currentUser?.uid,
  ]);

  return snapshot.docs.map((doc) => {
    return doc.id;
  });
};

export const getUserJoinedRooms = async (userId?: string) => {
  const snapshot = await getDocs(Collection.Rooms, [
    `${RoomField.GuestsIds}`,
    "array-contains",
    userId ? userId : auth.currentUser?.uid,
  ]);

  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      [RoomField.Guests]: doc.get(RoomField.Guests) as Room[RoomField.Guests],
    };
  });
};
