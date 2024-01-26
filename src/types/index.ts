import { Timestamp } from "firebase/firestore";

export enum Dialogs {
  Settings = "Settings",
  JoinRoom = "JoinRoom",
  CreateRoom = "CreateRoom",
  ConfirmDeleteAccount = "ConfirmDeleteAccount",
  ConfirmDeleteRoom = "ConfirmDeleteRoom",
  ConfirmAbandonRoom = "ConfirmAbandonRoom",
  RoomInfoLogin = "RoomLogin",
  RoomInfoIsFull = "RoomInfoIsFull",
  JoinRoomFromURL = "joinRoomFromURL",
}

export enum Collection {
  Rooms = "rooms",
  Users = "users",
}

export enum UserField {
  Id = "id",
  DisplayName = "displayName",
}
export interface User {
  [UserField.Id]: string;
  [UserField.DisplayName]: string;
}

export type UserData = Omit<User, UserField.Id>;

export type UserDataPartial = Partial<UserData>;

export enum RoomField {
  Id = "id",
  CreateTime = "createTime",
  GroupId = "groupId",
  Name = "name",
  OwnerId = "ownerId",
  GuestsIds = "guestsIds",
}
export interface Room {
  [RoomField.Id]: string;
  [RoomField.CreateTime]: Timestamp;
  [RoomField.GroupId]: string;
  [RoomField.Name]: string;
  [RoomField.OwnerId]: string;
  [RoomField.GuestsIds]: string[];
}

export type RoomData = Omit<Room, RoomField.Id>;

export type RoomDataPartial = Partial<RoomData>;

export type RoomBasicData = Pick<Room, RoomField.Id | RoomField.Name>;

export type RoomDetailsData = Omit<Room, RoomField.GroupId> & {
  parsedGroupId: number;
  //here add owner and guests
};

export enum CommonErrors {
  LoginAsAValidUser = "Login as a valid user",
  CouldNotLogin = "Could not login",
  TheDocumentNotFound = "The document not found",
  TheRoomIsFull = "The room is full",
  DisplayNameInUse = "Display name already in use",
}
