"use client";
import React from "react";
import { SidebarItems } from "@/lib/constant";
import { useSession } from "@/lib/auth-client";
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
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ModeToggle } from "../mode-toggle";
import { UserProfile } from "../user-profile";
import NavMain from "./nav-main";
import Image from "next/image";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="w-full flex items-center justify-center h-[40px]">
          <Image
            loading="eager"
            src="/regen.webp"
            alt="Logo Regen"
            width={110}
            height={32}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <UserProfile
          userData={{
            name: user?.name || "John Doe",
            email: user?.email || "john.doe@example.com",
            avatar: user?.image || "/placeholder-user.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default AppSidebar;
