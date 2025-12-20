// @/components/SimpleProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface SimpleProtectedRouteProps {
  children: ReactNode;
}

export default function SimpleProtectedRoute({ children }: SimpleProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Simply check if "user" key exists in localStorage
        const userData = localStorage.getItem("user");
        
        if (userData) {
          try {
            // Try to parse it to ensure it's valid JSON
            JSON.parse(userData);
            setIsAuthenticated(true);
          } catch {
            // Even if it's not valid JSON, if the key exists, consider authenticated
            setIsAuthenticated(userData.length > 0);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkAuth();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && !isLoading) {
      const currentPath = window.location.pathname + window.location.search;
      setLocation(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return <>{children}</>;
}