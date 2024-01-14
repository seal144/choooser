import { Timestamp } from "firebase/firestore";

export enum RoomField {
  CreateTime = "createTime",
  Guests = "guests",
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
  [RoomField.CreateTime]: Timestamp;
  groupId: string;
  name: string;
  owner: string;
  [RoomField.Guests]: string[];
}
