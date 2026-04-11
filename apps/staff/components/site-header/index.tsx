"use client"
import { Button } from "@workspace/ui/components/button"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { usePathname } from 'next/navigation';
import { routeNames } from "@/lib/constant";
import { BellDot } from "lucide-react";
import Breadcrumbs from "../primitive/breadcrumbs";
import { Separator } from "@workspace/ui/components/separator";
import { ModeToggle } from "../mode-toggle";

interface SiteHeaderProps {
  className?: string;
}

const SiteHeader = ({ className }: SiteHeaderProps) => {
  const pathname = usePathname();
   const segments = pathname.split('/').filter(Boolean);
  const getTitle = () => {
    if (segments.length === 0) return "DrinkRegen";
    const lastSegment = segments[segments.length - 1];
    return routeNames[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };
  return (
    <header className={`flex h-(--header-height) shrink-0 py-2 bg-muted items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) ${className}`}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-3" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost">
            <BellDot className="h-4 w-4" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
export default SiteHeader
