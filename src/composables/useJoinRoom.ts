import { ref } from "vue";
import CryptoJS from "crypto-js";

import { getDocs, updateDoc } from "@/firebase/docs";
import getUser from "./getUser";
import { maxGuestsInRoom } from "./../utils/validation";
import { CommonErrors, RoomDataDB, RoomField, Collection } from "@/types";

type RoomFormData = {
  name: string;
  password: string;
};

export enum ErrorJoinRoom {
  InvalidPassword = "Invalid Password",
}

const loading = ref(false);
const error = ref<string | null>(null);

const validateParticipants = (userId: string, participants: string[]) => {
  if (participants.includes(userId)) {
    throw new Error("You are already a participant of this room");
  }
  if (participants.length >= maxGuestsInRoom + 1) {
    throw new Error(
      `The room is full (max ${maxGuestsInRoom + 1} participants)`
    );
  }
};

const validateRoom = (roomGroupId: string, passedGroupId: string) => {
  if (!roomGroupId) {
    return;
  }
  const parsedRoomGroupId = CryptoJS.AES.decrypt(
    roomGroupId,
    import.meta.env.VITE_CRYPTO_JS_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  if (parsedRoomGroupId !== passedGroupId) {
    throw new Error(ErrorJoinRoom.InvalidPassword);
  }
};

const joinRoom = async (roomFormData: RoomFormData) => {
  loading.value = true;
  error.value = null;

  try {
    const { user } = getUser();
    if (!user.value) {
      throw new Error(CommonErrors.LoginAsAValidUser);
    }

    const snapshot = await getDocs(Collection.Rooms, [
      RoomField.Name,
      "==",
      roomFormData.name,
    ]);

    if (snapshot.empty) {
      throw new Error("No room with such a name");
    }

    const { groupId, guestsIds, ownerId } =
      snapshot.docs[0].data() as RoomDataDB;
    const roomId = snapshot.docs[0].id;

    validateParticipants(user.value.uid, [...guestsIds, ownerId]);
    validateRoom(groupId, roomFormData.password);

    await updateDoc(Collection.Rooms, roomId, {
      guestsIds: [...guestsIds, user.value.uid],
    });

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    loading.value = false;
    error.value = message;
  }
};

const resetError = () => {
  error.value = null;
};

const useJoinRoom = () => {
  return { joinRoom, loading, error, resetError };
};

export default useJoinRoom;
