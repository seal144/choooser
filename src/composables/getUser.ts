import { ref } from "vue";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/store/userStore";

const user = ref(auth.currentUser);
const userStore = useUserStore();

onAuthStateChanged(auth, (newUser) => {
  user.value = newUser;
  userStore.displayName = newUser?.displayName;
});

const getUser = () => {
  return { user };
};

export default getUser;
