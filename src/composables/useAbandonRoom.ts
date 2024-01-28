import { ref } from "vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { CommonErrors, Room, RoomField, Collection } from "@/types";

const loading = ref(false);
const error = ref<string | null>(null);

const abandonRoom = async (roomId: string) => {
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

    const currentGuestsIds: Room[RoomField.GuestsIds] = snapshot.get(
      RoomField.GuestsIds
    );
    const currentGuests: Room[RoomField.Guests] = snapshot.get(
      RoomField.Guests
    );

    const newGuestsIds = currentGuestsIds.filter(
      (guestId) => guestId !== auth.currentUser?.uid
    );

    const newGuests = currentGuests.filter(
      (guest) => guest.id !== auth.currentUser?.uid
    );

    await updateDoc(docRef, {
      [RoomField.GuestsIds]: [...newGuestsIds],
      [RoomField.Guests]: [...newGuests],
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
