import { Book, History, Settings, User, UserLock, Workflow } from "lucide-react";

export const SidebarItems = [
  {
    title: "Info",
    url: "/info",
    icon: Book,
  },
  {
    title: "Staff Directory",
    url: "/staff",
    icon: User,
  },
  {
    title : "Division",
    url : "/division",
    icon : Workflow,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: UserLock,
  },
  {
    title: "Activity Logs",
    url: "/activity-logs",
    icon: History,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  }
];

export const routeNames : Record<string, string> = {
  "/": "Home",
  "/staff-directory": "Staff Directory",
  "/staff-directory/new-staff": "New Staff",
  "/staff-directory/staff-archive": "Staff Archive",
  "/product": "Product",
  "/landing-page": "Landing Page",
  "/staff-directory/settings": "Settings",
};

export const AdminTableHeaders: string[] = [
  "Time", 
  "Actor", 
  "Action", 
  "Target Staff", 
  "Target Email", 
  "Details"
];

export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email atau password yang kamu masukkan salah.",
  USER_NOT_FOUND: "Akun dengan email ini tidak ditemukan.",
  EMAIL_NOT_VERIFIED: "Email belum diverifikasi. Cek inbox kamu.",
  TOO_MANY_REQUESTS: "Terlalu banyak percobaan. Coba lagi nanti.",
};