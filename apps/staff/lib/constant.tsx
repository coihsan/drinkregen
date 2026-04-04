import { Settings, User, UserLock, Workflow } from "lucide-react";

export const SidebarItems = [
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

