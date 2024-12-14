"use client";

import { useState } from "react";
import NavBar from "@/components/admin/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F2F7]">
      <NavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Button
          variant="ghost"
          className="absolute left-4 top-4 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <main className="flex-1 overflow-y-auto px-4 md:px-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
