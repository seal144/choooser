import { ref } from "vue";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { CommonErrors, Room, RoomField, Collection, UserField } from "@/types";

const loading = ref(false);
const error = ref<string | null>(null);

const abandonRoom = async (roomId: string, userId?: string) => {
  loading.value = true;
  error.value = null;

  try {
    if (!auth.currentUser) {
      throw new Error(CommonErrors.LoginAsAValidUser);
    }

    const docRef = doc(db, Collection.Rooms, roomId);

    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error(CommonErrors.TheDocumentNotFound);
    }

    const currentGuests: Room[RoomField.Guests] = snapshot.get(
      RoomField.Guests
    );

    const userAbandoningId = userId ? userId : auth.currentUser?.uid;
    const abandoningUser = currentGuests.find(
      (user) => user.id === userAbandoningId
    );

    if (!abandoningUser) {
      throw new Error(CommonErrors.TheUserNotFound);
    }

    await updateDoc(docRef, {
      [RoomField.GuestsIds]: arrayRemove(userAbandoningId),
      [RoomField.Guests]: arrayRemove(abandoningUser),
      [RoomField.PastGuests]: arrayUnion(abandoningUser),
    });

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    loading.value = false;
    error.value = message;
  }
};

const useAbandonRoom = () => {
  return { abandonRoom, loading, error };
};

export default useAbandonRoom;
