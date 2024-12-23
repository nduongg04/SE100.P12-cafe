"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../Icons";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { resetCookies } from "@/lib/action";

type IconNameType =
  | "dashboard"
  | "menu"
  | "voucher"
  | "customer"
  | "order"
  | "employee"
  | "bill"
  | "analytics"
  | "table";

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavBar = ({ isOpen, onClose }: NavBarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const routes: {
    label: string;
    href: string;
    icon: IconNameType;
  }[] = [
    {
      label: "Menu",
      href: "/admin",
      icon: "menu",
    },
    {
      label: "Table",
      href: "/admin/table",
      icon: "table",
    },
    {
      label: "Voucher",
      href: "/admin/voucher",
      icon: "voucher",
    },
    {
      label: "Customer",
      href: "/admin/customer",
      icon: "customer",
    },
    {
      label: "Order",
      href: "/admin/order",
      icon: "order",
    },
    {
      label: "Employee",
      href: "/admin/employee",
      icon: "employee",
    },
    {
      label: "Bill",
      href: "/admin/bill",
      icon: "bill",
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: "analytics",
    }, 
  ];

  const getIconComponent = (iconName: IconNameType, className?: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className={className} /> : null;
  };
  const onLogout = async () => {
    await resetCookies();
    router.replace("/login");
  };
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-10 bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between p-4 md:p-7">
        <Link href="/admin" className="flex flex-col gap-1">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={150}
            height={150}
          />
          <p className="font-barlow text-xs font-medium text-light-gray">
            Modern Admin Dashboard
          </p>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <div
          className="absolute left-0 flex h-12 w-full items-center transition-all duration-300"
          style={{
            transform: `translateY(${
              routes.findIndex((route) => route.href === pathname) * 48
            }px)`,
          }}
        >
          <div className="h-[70%] w-1 bg-dark-green py-4" />
          <div className="absolute inset-y-0 left-1 right-0 rounded-r-md bg-dark-green/15" />
        </div>

        <div className="flex flex-1 flex-col">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "relative z-10 flex items-center gap-2 px-8 py-3 transition-all duration-100",
                pathname === route.href
                  ? "font-semibold text-dark-green"
                  : "text-black-purple hover:bg-gray-100",
              )}
              onClick={onClose}
            >
              {getIconComponent(route.icon, "transition-colors duration-300")}
              <span className="text-base font-medium transition-colors duration-300">
                {route.label}
              </span>
            </Link>
          ))}
        </div>
        <button
          className="mx-6 mb-6 rounded-md bg-[#FF6767] py-2 font-bold text-white shadow-md"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
