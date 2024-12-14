"use client";
import React, { useState } from 'react'
import Navbar from '@/components/employee/Navbar'
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
type Props = {
    children: React.ReactNode
}

export default function EmployeeLayout({children}: Props) {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-row bg-[#F3F2F7]">
      <Navbar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Button
          variant="ghost"
          className="absolute left-4 top-4 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <main className="flex-1 overflow-y-auto px-[0.5%] md:px-[1%]">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}