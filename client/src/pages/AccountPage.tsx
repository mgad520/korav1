import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Settings, Bell, Languages, MessageCircle, Info, Users, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function AccountPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [activeSection, setActiveSection] = useState("profile");
  const user = {
    name: "Mgad",
    phone: "+250792356500",
    level: "120",
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

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      console.log("Logging out...");
    }
  };

  // Content for different sections
  const renderContent = () => {
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
                    <span className="text-gray-600">{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">Phone Number</span>
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">Account Level</span>
                    <Badge className="bg-green-100 text-green-700">LEVEL {user.level}</Badge>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      {/* Mobile Layout - Unchanged */}
      <div className="md:hidden">
        {/* Green Overlay Section */}
        <div className="bg-green-600 text-white pt-8 pb-16 px-6 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-r from-green-700 via-green-500 to-green-400"></div>
          </div>
          
          <div className="relative z-10 max-w-md mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">My Profile</h1>
              <p className="text-green-100 opacity-90">Manage your account settings</p>
            </div>

            {/* Profile Card on Green Background */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarFallback className="bg-white text-green-600 font-semibold text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-white font-semibold text-lg mb-1">
                      {user.name}
                    </h2>
                    <p className="text-green-100 text-sm mb-2">
                      {user.phone}
                    </p>
                    <Badge className="bg-white text-green-600 border-0 px-3 py-1 font-semibold">
                      LEVEL {user.level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-md mx-auto px-6 -mt-8 relative z-20">
          {/* Settings Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-0">
              {/* Settings Header */}
              <div className="flex items-center gap-3 p-6 border-b border-gray-100">
                <Settings className="h-5 w-5 text-green-600" />
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
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Icon className="h-4 w-4 text-green-600" />
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

          {/* Log Out Button */}
          <Button 
            variant="ghost" 
            className="w-full mt-6 text-gray-700 hover:bg-gray-100 h-12 border border-gray-200 shadow-sm font-medium"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>

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
              <Card className="shadow-lg bg-gradient-to-b from-green-700 via-green-500 to-green-400  border-0 sticky top-8">
                <CardContent className="p-6">
                  {/* Profile Section */}
                  <div className="text-center mb-8">
                    <Avatar className="h-24 w-24 border-4 border-green-500 mx-auto mb-4">
                      <AvatarFallback className="bg-white text-green-500 font-semibold text-xl">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {user.name}
                    </h2>
                    <p className="text-gray-200 mb-2">
                      {user.phone}
                    </p>
                    <Badge className="bg-green-500 text-white border-0 px-3 py-1 font-semibold">
                      LEVEL {user.level}
                    </Badge>
                  </div>

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

                  {/* Log Out Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-12 mt-6 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Log out
                  </Button>

                  {/* Version */}
                  <div className="text-center mt-6 pt-6 border-t">
                    <p className="text-gray-500 text-sm">
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