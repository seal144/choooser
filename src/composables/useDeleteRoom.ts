import { ref } from "vue";
import { db } from "@/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

const loading = ref(false);
const error = ref<string | null>(null);

const deleteRoom = async (roomId: string) => {
  loading.value = true;
  error.value = null;

  try {
    const docRef = doc(db, "rooms", roomId);

    await deleteDoc(docRef);

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    loading.value = false;
    error.value = message;
  }
};

const useDeleteRoom = () => {
  return { deleteRoom, loading, error };
};

export default useDeleteRoom;
