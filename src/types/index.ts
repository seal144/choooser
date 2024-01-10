export enum Dialogs {
  Settings = "SETTINGS",
  JoinRoom = "JOINROOM",
  CreateRoom = "CREATEROOM",
  ConfirmDeleteAccount = "CONFIRMDELETEACCOUNT",
  ConfirmDeleteRoom = "CONFIRMDELETEROOM",
}

export interface Room {
  id: string;
  groupId: string;
  name: string;
  owner: string;
  guests: string[];
}
