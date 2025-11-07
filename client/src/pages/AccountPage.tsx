import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Settings, Bell, Languages, MessageCircle, Info, Users, LogOut, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";

export default function AccountPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [, setLocation] = useLocation();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          // Check if user is guest (you might want to add a guest flag to your user object)
          setIsGuest(parsedUser.isGuest || false);
        } else {
          setIsGuest(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setIsGuest(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      setLocation("/");
      window.location.reload(); // Refresh to update the whole app state
    }
  };

  const handleLoginRedirect = () => {
    setLocation("/login");
  };

  const handleSignupRedirect = () => {
    setLocation("/signup");
  };

  const menuItems = [
    {
      title: "Language",
      value: language,
      hasArrow: true,
      type: "language",
      icon: Languages,
    },
    {
      title: "Notification",
      value: "",
      hasArrow: false,
      type: "notification",
      icon: Bell,
    },
    {
      title: "Whatsapp Us !",
      value: "",
      hasArrow: true,
      type: "whatsapp",
      icon: MessageCircle,
    },
    {
      title: "About Kora",
      value: "",
      hasArrow: true,
      type: "about",
      icon: Info,
    },
    {
      title: "Invite Friends",
      value: "",
      hasArrow: true,
      type: "invite",
      icon: Users,
    },
  ];

  const handleLanguageSelect = () => {
    setLanguage(current => current === "English" ? "Kinyarwanda" : "English");
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = "+250792356500";
    const message = "Hello! I'd like to get in touch about Kora.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInviteFriends = () => {
    const shareText = "Check out Kora app! It's amazing for learning and practice.";
    
    if (navigator.share) {
      navigator.share({
        title: 'Invite to Kora',
        text: shareText,
        url: window.location.href,
      })
      .catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Invite text copied to clipboard!'))
        .catch(() => alert(shareText));
    }
  };

  const handleMenuItemClick = (type: string) => {
    switch (type) {
      case "language":
        handleLanguageSelect();
        break;
      case "whatsapp":
        handleWhatsAppClick();
        break;
      case "invite":
        handleInviteFriends();
        break;
      case "about":
        alert("About Kora: This is a learning platform...");
        break;
      default:
        break;
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (isGuest) return "G";
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  // Get full name
  const getFullName = () => {
    if (isGuest) return "Guest User";
    if (!user) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.loginEmail || "User";
  };

  // Get email
  const getEmail = () => {
    if (isGuest) return "guest@example.com";
    return user?.loginEmail || "---";
  };

  // Get phone number
  const getPhoneNumber = () => {
    if (isGuest) return "---";
    return user?.phone || "---";
  };

  // Get user level
  const getUserLevel = () => {
    if (isGuest) return "Guest";
    return user?.level || "Free Plan";
  };

  // Get account creation date
  const getAccountCreatedDate = () => {
    if (isGuest) return "---";
    if (!user?.createdDate && !user?._createdDate) return "---";
    return new Date(user.createdDate || user._createdDate).toLocaleDateString();
  };

  // Get last login date
  const getLastLoginDate = () => {
    if (isGuest) return "---";
    if (!user?.lastLogin) return "---";
    return new Date(user.lastLogin).toLocaleDateString();
  };

  // Content for different sections
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      );
    }

    if (isGuest) {
      return (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Mode</h2>
          <p className="text-gray-600 mb-6">Sign in to access all features and save your progress</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleLoginRedirect}>
              Sign In
            </Button>
            <Button variant="outline" onClick={handleSignupRedirect}>
              Create Account
            </Button>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No User Found</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Button onClick={handleLoginRedirect}>
            Go to Login
          </Button>
        </div>
      );
    }

    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">Full Name</span>
                    <span className="text-gray-600">{getFullName()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">Email</span>
                    <span className="text-gray-600">{getEmail()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">Phone Number</span>
                    <span className="text-gray-600">{getPhoneNumber()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">Account Created</span>
                    <span className="text-gray-600">{getAccountCreatedDate()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">Last Login</span>
                    <span className="text-gray-600">{getLastLoginDate()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">Account Level</span>
                    <Badge className={`${
                      isGuest 
                        ? "bg-gray-100 text-gray-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {getUserLevel()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => item.type !== "notification" && handleMenuItemClick(item.type)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-gray-100 rounded-lg">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block text-lg">
                              {item.title}
                            </span>
                            {item.type === "language" && (
                              <span className="text-gray-500">
                                Current: {language}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {item.type === "notification" && (
                            <Switch
                              checked={notificationsEnabled}
                              onCheckedChange={setNotificationsEnabled}
                            />
                          )}
                          
                          {item.hasArrow && (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Settings</h2>
            <p className="text-gray-600">Select an option from the sidebar to get started</p>
          </div>
        );
    }
  };

  // Show loading state for the whole page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Green Overlay Section */}
        <div className={`${isGuest ? "bg-gray-600" : "bg-green-600"} text-white pt-8 pb-16 px-6 relative`}>
          <div className="absolute inset-0 opacity-10">
            <div className={`w-full h-full bg-gradient-to-r ${
              isGuest 
                ? "from-gray-700 via-gray-500 to-gray-400" 
                : "from-green-700 via-green-500 to-green-400"
            }`}></div>
          </div>
          
          <div className="relative z-10 max-w-md mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">My Profile</h1>
              <p className={`${isGuest ? "text-gray-100" : "text-green-100"} opacity-90`}>
                {isGuest ? "Guest Mode - Limited Access" : "Manage your account settings"}
              </p>
            </div>

            {/* Profile Card on Background */}
            <Card className={`${
              isGuest 
                ? "bg-white/10 backdrop-blur-sm border-white/20" 
                : "bg-white/10 backdrop-blur-sm border-white/20"
            } shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className={`h-16 w-16 border-2 ${
                    isGuest ? "border-gray-300" : "border-white"
                  }`}>
                    <AvatarFallback className={`${
                      isGuest 
                        ? "bg-gray-300 text-gray-600" 
                        : "bg-white text-green-600"
                    } font-semibold text-lg`}>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-white font-semibold text-lg mb-1">
                      {getFullName()}
                    </h2>
                    <p className={`${
                      isGuest ? "text-gray-100" : "text-green-100"
                    } text-sm mb-2`}>
                      {getEmail()}
                    </p>
                    <Badge className={`${
                      isGuest
                        ? "bg-gray-300 text-gray-700"
                        : "bg-white text-green-600"
                    } border-0 px-3 py-1 font-semibold`}>
                      {getUserLevel()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-md mx-auto px-6 -mt-8 relative z-20">
          {/* Guest Mode Notice */}
          {isGuest && (
            <Card className="shadow-lg border-0 mb-4 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-yellow-800 font-medium text-sm">
                      You're in guest mode
                    </p>
                    <p className="text-yellow-700 text-xs">
                      Sign in to access all features and save your progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-0">
              {/* Settings Header */}
              <div className="flex items-center gap-3 p-6 border-b border-gray-100">
                <Settings className={`h-5 w-5 ${isGuest ? "text-gray-600" : "text-green-600"}`} />
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              </div>

              {/* Menu Items */}
              <div className="divide-y divide-gray-100">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => item.type !== "notification" && handleMenuItemClick(item.type)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          isGuest ? "bg-gray-50" : "bg-green-50"
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isGuest ? "text-gray-600" : "text-green-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-900 font-medium block">
                            {item.title}
                          </span>
                          {item.type === "language" && (
                            <span className="text-gray-500 text-sm">
                              {language}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.type === "notification" && (
                          <Switch
                            checked={notificationsEnabled}
                            onCheckedChange={setNotificationsEnabled}
                          />
                        )}
                        
                        {item.hasArrow && (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mt-6">
            {isGuest ? (
              <>
                <Button 
                  className="w-full h-12 font-medium shadow-sm"
                  onClick={handleLoginRedirect}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In to Account
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12 text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm font-medium"
                  onClick={handleSignupRedirect}
                >
                  Create New Account
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                className="w-full h-12 text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm font-medium"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            )}
          </div>

          {/* Version */}
          <div className="text-center mt-8 pb-8">
            <p className="text-gray-500 text-sm">
              Kora • version
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Sidebar + Content */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-4">
              <Card className={`shadow-lg border-0 sticky top-8 bg-gradient-to-b ${
                isGuest
                  ? "from-gray-700 via-gray-500 to-gray-400"
                  : "from-green-700 via-green-500 to-green-400"
              }`}>
                <CardContent className="p-6">
                  {/* Profile Section */}
                  <div className="text-center mb-8">
                    <Avatar className={`h-24 w-24 border-4 mx-auto mb-4 ${
                      isGuest ? "border-gray-400" : "border-green-500"
                    }`}>
                      <AvatarFallback className={`${
                        isGuest 
                          ? "bg-gray-300 text-gray-600" 
                          : "bg-white text-green-500"
                      } font-semibold text-xl`}>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {getFullName()}
                    </h2>
                    <p className="text-gray-200 mb-2">
                      {getEmail()}
                    </p>
                    <Badge className={`${
                      isGuest
                        ? "bg-gray-500 text-white"
                        : "bg-green-500 text-white"
                    } border-0 px-3 py-1 font-semibold`}>
                      {getUserLevel()}
                    </Badge>
                  </div>

                  {/* Guest Notice */}
                  {isGuest && (
                    <div className="bg-white/20 rounded-lg p-3 mb-4">
                      <p className="text-white text-sm text-center">
                        Sign in to access all features
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="space-y-2">
                    <Button
                      variant={activeSection === "profile" ? "default" : "ghost"}
                      className="w-full justify-start h-12"
                      onClick={() => setActiveSection("profile")}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Profile Information
                    </Button>
                    
                    <Button
                      variant={activeSection === "settings" ? "default" : "ghost"}
                      className="w-full justify-start h-12"
                      onClick={() => setActiveSection("settings")}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-2">
                    {isGuest ? (
                      <>
                        <Button 
                          className="w-full justify-start h-12 bg-white text-gray-700 hover:bg-gray-100"
                          onClick={handleLoginRedirect}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Sign In
                        </Button>
                        <Button 
                          variant="ghost"
                          className="w-full justify-start h-12 text-white hover:bg-white/10"
                          onClick={handleSignupRedirect}
                        >
                          Create Account
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-12 text-white hover:bg-white/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Log out
                      </Button>
                    )}
                  </div>

                  {/* Version */}
                  <div className="text-center mt-6 pt-6 border-t border-white/20">
                    <p className="text-gray-300 text-sm">
                      Kora • version
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="col-span-8">
              <Card className="shadow-lg border-0 min-h-[600px]">
                <CardContent className="p-8">
                  {renderContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}