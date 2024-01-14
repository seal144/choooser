import { Timestamp } from "firebase/firestore";

export enum RoomField {
  createTime = "createTime",
  guests = "guests",
}

export enum Dialogs {
  Settings = "SETTINGS",
  JoinRoom = "JOINROOM",
  CreateRoom = "CREATEROOM",
  ConfirmDeleteAccount = "CONFIRMDELETEACCOUNT",
  ConfirmDeleteRoom = "CONFIRMDELETEROOM",
  ConfirmAbandonRoom = "CONFIRMABANDONROOM",
}

export interface Room {
  id: string;
  [RoomField.createTime]: Timestamp;
  groupId: string;
  name: string;
  owner: string;
  [RoomField.guests]: string[];
}
