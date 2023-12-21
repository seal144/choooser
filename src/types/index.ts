export enum Dialogs {
  Settings = "SETTINGS",
  JoinRoom = "JOINROOM",
  CreateRoom = "CREATEROOM",
  ConfirmDeleteAccount = "CONFIRMDELETEACCOUNT",
}

export interface Room {
  id: string;
  groupId: string;
  name: string;
  owner: string;
  guests: string[];
}
