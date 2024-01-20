import { Timestamp } from "firebase/firestore";

export enum RoomField {
  CreateTime = "createTime",
  Guests = "guests",
}

export enum Dialogs {
  Settings = "Settings",
  JoinRoom = "JoinRoom",
  CreateRoom = "CreateRoom",
  ConfirmDeleteAccount = "ConfirmDeleteAccount",
  ConfirmDeleteRoom = "ConfirmDeleteRoom",
  ConfirmAbandonRoom = "ConfirmAbandonRoom",
  RoomInfoLogin = "RoomLogin",
  RoomInfoIsFull = "RoomInfoIsFull",
  RoomPassword = "RoomPassword",
}

export interface Room {
  id: string;
  [RoomField.CreateTime]: Timestamp;
  groupId: string;
  name: string;
  owner: string;
  [RoomField.Guests]: string[];
}

export enum CommonErrors {
  LoginAsAValidUser = "Login as a valid user",
  CouldNotLogin = "Could not login",
}
