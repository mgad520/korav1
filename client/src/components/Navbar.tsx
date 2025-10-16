import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, HelpCircle, User, Home } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Ahabanza", icon: Home },
    { path: "/inyigisho", label: "Inyigisho", icon: BookOpen },
    { path: "/ibibazo", label: "Ibibazo", icon: HelpCircle },
    { path: "/konte", label: "Konte", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">RT</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Rwanda Traffic Academy</span>
            <span className="font-semibold text-lg sm:hidden">RTA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
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

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Injira</Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="button-signup">Kwiyandikisha</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <div className="pt-2 space-y-2">
              <Link href="/login">
                <Button variant="ghost" className="w-full" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-login">
                  Injira
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-signup">
                  Kwiyandikisha
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
