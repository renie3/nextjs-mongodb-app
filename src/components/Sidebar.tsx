"use client";

import Link from "next/link";
import {
  MdDashboard,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
} from "react-icons/md";
import { FaUsers, FaBloggerB } from "react-icons/fa";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/admin",
        icon: <MdDashboard />,
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: <FaUsers />,
      },
      {
        title: "Posts",
        path: "/admin/posts",
        icon: <FaBloggerB />,
      },
      {
        title: "Transactions",
        path: "/admin/transactions",
        icon: <MdAttachMoney />,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "Revenue",
        path: "/admin/revenue",
        icon: <MdWork />,
      },
      {
        title: "Reports",
        path: "/admin/reports",
        icon: <MdAnalytics />,
      },
      {
        title: "Teams",
        path: "/admin/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
    title: "Notifications",
    list: [
      {
        title: "Mail",
        path: "/admin/mail",
        icon: <MdWork />,
      },
      {
        title: "Feedback",
        path: "/admin/feedback",
        icon: <MdAnalytics />,
      },
      {
        title: "Message",
        path: "/admin/message",
        icon: <MdPeople />,
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  if (!pathname.startsWith("/admin")) return null;

  return (
    <div className="bg-bgSoft p-5 w-max sm:w-[250px] h-[calc(100vh-80px)] sticky top-0 rounded-tr-xl flex flex-col gap-5">
      {menuItems.map((item) => (
        <div key={item.title} className="flex flex-col gap-1">
          <h1 className="text-textSoft text-sm font-medium">{item.title}</h1>
          {item.list.map((link) => (
            <Link
              key={link.title}
              href={link.path}
              className={`flex items-center gap-3 hover:bg-blue-500 hover:text-white dark:hover:bg-white dark:hover:text-black p-3 rounded-md ${
                pathname === link.path &&
                "bg-blue-500 dark:bg-white text-white dark:text-black"
              }`}
            >
              {link.icon}
              <span className="hidden sm:block">{link.title}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
