export enum Dialogs {
  Settings = "SETTINGS",
  JoinRoom = "JOINROOM",
  CreateRoom = "CREATEROOM",
  ConfirmDeleteAccount = "CONFIRMDELETEACCOUNT",
}

export interface User {
  id: string;
  displayName: string;
}

export interface Room {
  id: string;
  groupId: string;
  name: string;
  owner: User;
}
