"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, User, LogOut, Users, Search, Brain } from "lucide-react";

const navigationItems = [
  {
    name: "Explore",
    href: "/explore",
    icon: Search,
    requiresAuth: false,
  },
  {
    name: "Classroom",
    href: "/classroom",
    icon: Users,
    requiresAuth: true,
  },
  {
    name: "Created Problems",
    href: "/created-problems",
    icon: Brain,
    requiresAuth: true,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white">
                <Brain className="h-4 w-4" />
              </div>
              <span className="hidden font-bold text-xl sm:inline-block font-montserrat">
                Numerus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const canAccess = !item.requiresAuth || user;

              if (canAccess) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.username ? (
                          user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/motoko-login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/motoko-register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>
                    Access all navigation options and account settings
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl">AI Teach</span>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const canAccess = !item.requiresAuth || user;

                      if (canAccess) {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      } else {
                        return (
                          <button
                            key={item.name}
                            className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer text-left"
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </button>
                        );
                      }
                    })}
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {user.username ? (
                                user.username
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {user.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="justify-start px-3 py-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="ghost"
                          className="justify-start"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/login">Log in</Link>
                        </Button>
                        <Button
                          className="justify-start"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/register">Sign up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
