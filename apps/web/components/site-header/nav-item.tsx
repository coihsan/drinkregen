"use client";

import Link from "next/link";

interface NavMainProps {
  url: string;
  title: string;
  className?: string;
}

const NavItem = ({ url, title, className }: NavMainProps) => {
  return (
    <Link
      href={url}
      className={`relative font-semibold ${className}`}
    >
      {title}
    </Link>
  );
};
export default NavItem;
