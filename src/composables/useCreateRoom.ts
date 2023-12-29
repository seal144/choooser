import { ref } from "vue";
import { db } from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Room } from "@/types";
import getUser from "./getUser";

type RoomData = Omit<Room, "id">;
type RoomFormData = {
  name: string;
  password: string;
};

const loading = ref(false);
const error = ref<string | null>(null);

const createRoom = async (roomFormData: RoomFormData) => {
  const { user } = getUser();
  loading.value = true;
  error.value = null;

  const collectionRef = collection(db, "rooms");

  const getDocsQuery = query(
    collectionRef,
    where("name", "==", roomFormData.name)
  );

  try {
    if (!user.value) {
      throw new Error("Login as a valid user");
    }

    const snapshot = await getDocs(getDocsQuery);

    if (!snapshot.empty) {
      throw new Error("Name already in use");
    }

    const room: RoomData = {
      groupId: roomFormData.password,
      name: roomFormData.name,
      owner: user.value.uid,
      guests: [],
    };

    await addDoc(collectionRef, room);
    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.log(message);
    loading.value = false;
    error.value = message;
  }
};

const resetError = () => {
  error.value = null;
};

const useCreateRoom = () => {
  return { createRoom, loading, error, resetError };
};

export default useCreateRoom;
