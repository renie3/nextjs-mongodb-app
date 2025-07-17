"use client";

import { LinkType } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({
  link,
  isMobile,
  onClick,
}: {
  link: LinkType;
  isMobile?: boolean;
  onClick?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <Link
      className={`${
        isMobile
          ? "w-full p-3 text-center text-lg font-medium rounded-md hover:bg-blue-500 hover:text-white dark:hover:bg-white dark:hover:text-black"
          : "py-1 px-3 rounded-full text-lg font-medium"
      }
       ${
         pathname === link.path &&
         "bg-blue-500 dark:bg-white text-white dark:text-black"
       }`}
      href={link.path}
      onClick={onClick}
    >
      {link.title}
    </Link>
  );
};
export default NavLink;
