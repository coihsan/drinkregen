import { Box, Package, Settings, User } from "lucide-react";

export const SidebarItems = [
  {
    title: "Staff Directory",
    href: "/staff-directory",
    icon: <User />,
  },
  {
    title: "Product",
    href: "/product",
    icon: <Box />,
  },
  {
    title: "Landing Page",
    href: "/landing-page",
    icon: <Package />,
  },
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
