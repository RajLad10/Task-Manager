"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";

import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function DashboardSidebar({ onLinkClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
        dispatch(logoutUser({ 
            cb: () => router.replace("/login") 
        }));
    };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "Projects", href: "/dashboard/projects", icon: <FolderIcon fontSize="small" /> }
  ];

  return (
    <aside className="bg-white shadow-xl w-64 h-full p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-8 tracking-tight text-gray-800">
        Task Manager
      </h2>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${
                active
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm"
      >
        <LogoutIcon fontSize="small" />
        Logout
      </button>
    </aside>
  );
}
