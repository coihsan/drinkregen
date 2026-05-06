"use client";

import Link from "next/link";

interface NavMainProps {
  url: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

const NavItem = ({ url, title, className, onClick }: NavMainProps) => {
  return (
    <Link href={url} className={`relative font-semibold ${className}`} onClick={onClick}>
      {title}
    </Link>
  );
};
export default NavItem;
