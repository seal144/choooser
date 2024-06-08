import { ref } from "vue";
import { updateProfile, deleteUser as deleteUserFirebase } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import isUserNameInUse from "@/firebase/isUserNameInUse";
import { updateDoc } from "@/firebase/docs";
import { getUserOwnedRooms, getUserJoinedRooms } from "@/firebase/getUserRooms";
import { useUserStore } from "@/store/userStore";
import { Collection, CommonErrors, RoomField } from "@/types";
import useDeleteRoom from "./useDeleteRoom";
import useAbandonRoom from "./useAbandonRoom";

const error = ref<string | null>(null);
const loadingUpdateDisplayName = ref(false);
const loadingDeleteUser = ref(false);
const userStore = useUserStore();
const { deleteRoom } = useDeleteRoom();
const { abandonRoom } = useAbandonRoom();

const updateDisplayName = async (displayName: string) => {
  error.value = null;
  loadingUpdateDisplayName.value = true;

  if (auth.currentUser) {
    try {
      const userNameInUse = await isUserNameInUse(displayName);
      if (userNameInUse) {
        throw new Error(CommonErrors.DisplayNameInUse);
      }

      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(Collection.Users, auth.currentUser.uid, { displayName });

      const userRoomsAsOwner = await getUserOwnedRooms();
      const userRoomsAsGuest = await getUserJoinedRooms();

      userRoomsAsOwner.forEach(async (roomId) => {
        if (auth.currentUser) {
          await updateDoc(Collection.Rooms, roomId, {
            [RoomField.Owner]: {
              id: auth.currentUser.uid,
              displayName,
            },
          });
        }
      });

      userRoomsAsGuest.forEach(async (room) => {
        if (auth.currentUser) {
          const userIndex = room.guests.findIndex(
            (guest) => guest.id === auth.currentUser?.uid
          );

          const newGuests = [...room.guests];
          newGuests[userIndex] = { id: auth.currentUser.uid, displayName };

          await updateDoc(Collection.Rooms, room.id, {
            [RoomField.Guests]: newGuests,
          });
        }
      });

      userStore.displayName = auth.currentUser.displayName;

      loadingUpdateDisplayName.value = false;
    } catch (err) {
      const { message } = err as Error;
      console.error(message);
      error.value = message;
      loadingUpdateDisplayName.value = false;
    }
  }
};

const deleteUserData = async (userId?: string) => {
  if (auth?.currentUser) {
    const userRef = doc(
      db,
      Collection.Users,
      userId ? userId : auth.currentUser.uid
    );
    await deleteDoc(userRef);

    const userRoomsAsOwner = await getUserOwnedRooms(userId);
    const userRoomsAsGuest = await getUserJoinedRooms(userId);

    userRoomsAsOwner.forEach(async (roomId) => {
      await deleteRoom(roomId);
    });

    userRoomsAsGuest.forEach(async (room) => {
      await abandonRoom(room.id, userId);
    });
  }
};

const deleteUser = async () => {
  error.value = null;
  loadingDeleteUser.value = true;

  if (auth.currentUser) {
    try {
      await deleteUserData();

      await deleteUserFirebase(auth.currentUser);

      loadingDeleteUser.value = false;
    } catch (err) {
      const { message } = err as Error;
      console.error(message);
      error.value = message;
      loadingDeleteUser.value = false;
    }
  }
};

const resetError = () => {
  error.value = null;
};

const useUser = () => ({
  updateDisplayName,
  loadingUpdateDisplayName,
  deleteUser,
  deleteUserData,
  loadingDeleteUser,
  error,
  resetError,
});

export default useUser;
