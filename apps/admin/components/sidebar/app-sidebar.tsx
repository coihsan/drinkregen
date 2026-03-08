"use client";
import React from "react";
import { SidebarItems } from "@/lib/constant";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ModeToggle } from "../mode-toggle";
import { UserProfile } from "../user-profile";

const AppSidebar = ({...props} : React.ComponentProps<typeof Sidebar>) => {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="flex flex-col gap-2">
              {SidebarItems.map((item) => (
                <SidebarMenuButton tooltip={item.title} key={item.href}>
                  {item.icon}
                  <a href={item.href}>{item.title}</a>
                </SidebarMenuButton>
              ))}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <UserProfile
          user={{
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "/placeholder-user.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
