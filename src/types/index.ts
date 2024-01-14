import { Timestamp } from "firebase/firestore";

export enum RoomField {
  createTime = "createTime",
  guests = "guests",
}

export enum Dialogs {
  Settings,
  JoinRoom,
  CreateRoom,
  ConfirmDeleteAccount,
  ConfirmDeleteRoom,
  ConfirmAbandonRoom,
}

export interface Room {
  id: string;
  [RoomField.createTime]: Timestamp;
  groupId: string;
  name: string;
  owner: string;
  [RoomField.guests]: string[];
}
