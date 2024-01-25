import { getDocs } from "./docs";
import { Collection, UserField } from "@/types";

const isUserNameInUse = async (displayName: string) => {
  const snapshot = await getDocs(Collection.Users, [
    UserField.DisplayName,
    "==",
    displayName,
  ]);

  if (!snapshot.empty) {
    return true;
  }

  return false;
};

export default isUserNameInUse;
