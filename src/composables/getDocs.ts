import { db } from "@/firebase/config";
import {
  collection,
  getDocs as getDocsFireStore,
  query as queryFireStore,
  where,
  WhereFilterOp,
} from "firebase/firestore";

const getDocs = async (
  collectionName: string,
  query: [string, WhereFilterOp, string]
) => {
  const q = queryFireStore(
    collection(db, collectionName),
    where(query[0], query[1], query[2])
  );

  const snapshot = await getDocsFireStore(q);

  return snapshot;
};

export default getDocs;
