import { StaffTypes } from "./staff.types";

export enum MenuType {
  STAFF = "Staff",
  DIVISION = "Division",
  ARCHIVE = "Archive",
  SETTINGS = "Settings",
  ACCOUNT = "Account",
}

export interface AppState {
  menuToolbar: boolean;
  activeMenu: MenuType;
  loading: boolean;
  activeStaffId?: string;
  drawerOpen?: boolean;
  modalOpen?: boolean;
}

export interface StaffState {
  loading: boolean;
  activeStaffId?: string;
  selectedStaff?: StaffTypes;
}

export interface RootState {
  appState: AppState;
  staffState: StaffState;
}
