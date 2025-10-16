import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, User, Home } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Ahabanza", icon: Home },
    { path: "/inyigisho", label: "Inyigisho", icon: BookOpen },
    { path: "/ibibazo", label: "Ibibazo", icon: HelpCircle },
    { path: "/konte", label: "Konte", icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">RT</span>
              </div>
              <span className="font-semibold text-lg">Rwanda Traffic Academy</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="gap-2"
                        data-testid={`link-${item.label.toLowerCase()}`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
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
        </div>
      </nav>

      {/* Mobile Top Bar - Logo Only */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">RT</span>
              </div>
              <span className="font-semibold text-lg">RTA</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
