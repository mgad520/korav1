import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, User, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Ahabanza", icon: Home },
    { path: "/inyigisho", label: "Inyigisho", icon: BookOpen },
    { path: "/ibibazo", label: "Ibibazo", icon: HelpCircle },
    { path: "/konte", label: "Konte", icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex h-18 items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-desktop-menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      return (
                        <Link key={item.path} href={item.path}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3 text-base"
                            onClick={() => setDesktopMenuOpen(false)}
                            data-testid={`link-desktop-${item.label.toLowerCase()}`}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-xl">RT</span>
                </div>
                <span className="font-bold text-xl">Rwanda Traffic Academy</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">Injira</Button>
              </Link>
              <Link href="/signup">
                <Button data-testid="button-signup">Kwiyandikisha</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Logo Only */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm md:hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-lg">RT</span>
              </div>
              <span className="font-bold text-xl">RTA</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={`flex flex-col items-center justify-center h-full gap-1.5 transition-all ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
