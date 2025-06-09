"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Fields",
    href: "/admin/fields",
    icon: Calendar,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" />
              Exit Admin
            </Link>
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 flex flex-col gap-4">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}