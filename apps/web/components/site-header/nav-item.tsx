"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMainProps {
  url: string;
  title: string;
  
}

const NavItem = ({ url, title }: NavMainProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={url}
      className={`${pathname === url ? "text-lime-600" : "text-primary"} relative`}
    >
      {title}
    </Link>
  );
};
export default NavItem;
