"use client";

import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:ml-0 shadow-sm">
      <IconButton
        className="!md:hidden"
        onClick={() => setOpen(true)}
        aria-label="menu"
      >
        <MenuIcon className="!md:hidden" />
      </IconButton>

      {/* <h1 className="text-lg md:text-xl font-semibold tracking-tight text-gray-800 mx-auto md:mx-0">
        Dashboard
      </h1> */}

      <div className="w-10 md:hidden"></div>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div className="w-64 h-full">
          <DashboardSidebar onLinkClick={() => setOpen(false)} />
        </div>
      </Drawer>
    </header>
  );
}
