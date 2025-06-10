"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">SportsBook</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/fields" className="text-sm font-medium hover:text-primary transition-colors">
            Fields
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {!loading && !user && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  <User className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            </>
          )}
          {!loading && user && (
            <>
              <span className="text-sm mr-2">Hi, {user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/fields" className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMenuOpen(false)}>
              Fields
            </Link>
            <Link href="/about" className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMenuOpen(false)}>
              How It Works
            </Link>
            <Link href="/contact" className="px-2 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {!loading && !user && (
                <>
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="justify-start">
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </>
              )}
              {!loading && user && (
                <>
                  <span className="text-sm px-2 py-1">Hi, {user.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
