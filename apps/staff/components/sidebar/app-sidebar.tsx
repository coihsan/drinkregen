"use client";
import React from "react";
import { SidebarItems } from "@/lib/constant";
import { useSession } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
          {open ? (
            <Image
              loading="eager"
              src="/regen.webp"
              alt="Logo Regen"
              width={110}
              height={32}
            />
          ) : (
            <Image
              loading="eager"
              src="/favicon.png"
              alt="Logo Regen"
              width={110}
              height={32}
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <UserProfile
          userData={{
            name: user?.name || "Regen Staff",
            email: user?.email || "regen@example.com",
            avatar: user?.image || "/maskot.webp",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default AppSidebar;
