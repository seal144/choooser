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

export type UserDataDB = Omit<User, UserField.Id>;

export type UserDataDBPartial = Partial<UserDataDB>;

export enum RoomField {
  Id = "id",
  CreateTime = "createTime",
  GroupId = "groupId",
  ParsedGroupId = "parsedGroupId",
  Name = "name",
  OwnerId = "ownerId",
  GuestsIds = "guestsIds",
  Owner = "owner",
  Guests = "guests",
}
export interface Room {
  [RoomField.Id]: string;
  [RoomField.CreateTime]: Timestamp;
  [RoomField.GroupId]: string;
  [RoomField.ParsedGroupId]: 0 | 1;
  [RoomField.Name]: string;
  [RoomField.OwnerId]: string;
  [RoomField.GuestsIds]: string[];
  [RoomField.Owner]: User | null;
  [RoomField.Guests]: User[];
}

export type RoomDataDB = Omit<
  Room,
  RoomField.Id | RoomField.Owner | RoomField.Guests | RoomField.ParsedGroupId
>;

export type RoomDataDBPartial = Partial<RoomDataDB>;

export type RoomBasicData = Pick<Room, RoomField.Id | RoomField.Name>;

export type RoomDetailsData = Pick<
  Room,
  | RoomField.Id
  | RoomField.CreateTime
  | RoomField.ParsedGroupId
  | RoomField.Name
  | RoomField.OwnerId
  | RoomField.GuestsIds
  | RoomField.Owner
  | RoomField.Guests
>;

export enum CommonErrors {
  LoginAsAValidUser = "Login as a valid user",
  CouldNotLogin = "Could not login",
  TheDocumentNotFound = "The document not found",
  TheRoomIsFull = "The room is full",
  DisplayNameInUse = "Display name already in use",
}
