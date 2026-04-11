import { BoardType } from "./enums";

export interface AppState {
    activeView: BoardType
}

export type ActiveModal =
  | "edit-login"
  | "reset-password"
  | "demote"
  | "share-button"
  | "delete"
  | "archive-staff"
  | null;
