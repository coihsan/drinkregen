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
      className={`${pathname === url ? "bg-lime-600" : "bg-lime-500"} relative overflow-hidden rounded-md px-5 py-2.5 text-white duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90`}
    >
      {title}
    </Link>
  );
};
export default NavItem;
