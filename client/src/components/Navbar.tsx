import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  HelpCircle,
  User,
  Home,
  Menu,
  LogOut,
  Settings,
  UserCircle,
  Globe,
} from "lucide-react";
import { FaHome, FaUser, FaBook } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error checking user auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setLocation("/ahabanza");
    window.location.reload(); // Refresh to update the whole app state
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleSignup = () => {
    setLocation("/login?mode=signup");
  };

  const navItems = [
    { path: "/ahabanza", label: "Ahabanza", icon: FaHome },
    { path: "/ibibazo", label: "Ibibazo", icon: FaBook },
    { path: "/konte", label: "Konte", icon: User },
  ];

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "rw", name: "Kinyarwanda", native: "Kinyarwanda" },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    console.log("Language changed to:", languageCode);
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        {/* Desktop Navigation Loading */}
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-xl">K</span>
                </div>
                <span className="font-bold text-xl">Kora</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-9 bg-muted rounded-md animate-pulse"></div>
                <div className="w-24 h-9 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Top Bar Loading */}
        <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm md:hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-lg">K</span>
                </div>
                <span className="font-bold text-xl">Kora</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation Loading */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg md:hidden pb-safe">
          <div className="grid grid-cols-3 h-16 px-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col items-center justify-center">
                <div className="w-5 h-5 bg-muted rounded animate-pulse mb-1"></div>
                <div className="w-12 h-3 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Compact Hover Menu */}
              <div className="relative">
                <div
                  onMouseEnter={() => setIsMenuHovered(true)}
                  onMouseLeave={() => setIsMenuHovered(false)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/50 transition-colors duration-200"
                    data-testid="button-desktop-menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 mt-1 w-48 bg-popover border border-border/60 rounded-lg shadow-lg z-50 transition-all duration-200 overflow-hidden ${
                      isMenuHovered
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
                      <h3 className="font-semibold text-sm text-foreground">Menu</h3>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location === item.path;
                        
                        return (
                          <Link key={item.path} href={item.path}>
                            <div className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150 cursor-pointer ${
                              isActive 
                                ? "bg-primary/10 text-primary font-medium" 
                                : "hover:bg-accent hover:text-foreground"
                            }`}>
                              <Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                              {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/ahabanza" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-xl">
                    K
                  </span>
                </div>
                <span className="font-bold text-xl">Kora</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{currentLanguage.toUpperCase()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Choose Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`cursor-pointer ${
                        currentLanguage === language.code ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {language.native}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-2"
                  >
                    {user ? (
                      // Show profile picture when logged in
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {user.loginEmail?.charAt(0)}
                      </div>
                    ) : (
                      // Show user icon when not logged in
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm">
                      {user ? `${user.loginEmail}` : "Injira"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.loginEmail}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/konte" className="cursor-pointer">
                          <UserCircle className="h-4 w-4 mr-2" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sohoka</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel>Nta konte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={handleLogin}
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Injira</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={handleSignup}
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        <span>Kwiyandikisha</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Logo and Account */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm md:hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/ahabanza" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-lg">
                  K
                </span>
              </div>
              <span className="font-bold text-xl">Kora</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Language Dropdown - Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Choose Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`cursor-pointer ${
                        currentLanguage === language.code ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {language.native}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account Dropdown - Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    {user ? (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-xs">
                        {user.loginEmail?.charAt(0)}
                      </div>
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.loginEmail}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/konte" className="cursor-pointer">
                          <UserCircle className="h-4 w-4 mr-2" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sohoka</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel>Nta konte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={handleLogin}
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Injira</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={handleSignup}
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        <span>Kwiyandikisha</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg md:hidden pb-safe">
        <div className="grid grid-cols-3 h-16 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={`flex flex-col items-center justify-center h-full gap-1 transition-all w-full ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "scale-110" : ""
                    } transition-transform`}
                  />
                  <span
                    className={`text-xs ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}