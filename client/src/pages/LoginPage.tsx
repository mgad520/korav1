import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { UserPlus, ChevronDown, Search, X, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // New state variables for phone/email toggle
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryOverlay, setShowCountryOverlay] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    id: "bbd058bf-d701-4c17-94c1-05ba0d054c19",
    title: "Rwanda",
    code: "+250",
    image: "https://flagcdn.com/w320/rw.png",
    country: "Rwanda",
  });

  // Redirect handling
  const [redirectTo, setRedirectTo] = useState("/ahabanza");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      if (next) setRedirectTo(next);
    } catch (e) {
      // ignore (window may be undefined in SSR)
    }
  }, []);

  useEffect(() => {
    // Fetch country codes from your Wix backend
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://api.rebamovie/countryCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
          setFilteredCountries(data);
        } else {
          console.error("Failed to fetch countries");
          const defaultCountries = [
            {
              id: "bbd058bf-d701-4c17-94c1-05ba0d054c19",
              title: "Rwanda",
              code: "+250",
              image: "https://flagcdn.com/w320/rw.png",
              country: "Rwanda",
            },
          ];
          setCountries(defaultCountries);
          setFilteredCountries(defaultCountries);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        const defaultCountries = [
          {
            id: "bbd058bf-d701-4c17-94c1-05ba0d054c19",
            title: "Rwanda",
            code: "+250",
            image: "https://flagcdn.com/w320/rw.png",
            country: "Rwanda",
          },
        ];
        setCountries(defaultCountries);
        setFilteredCountries(defaultCountries);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = countries.filter(
        (country) =>
          country.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.includes(searchQuery)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchQuery, countries]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  // Validation for empty fields
  if (!email && !phone) {
    setError("Please enter either email or phone number");
    setIsLoading(false);
    return;
  }

  if (!password) {
    setError("Please enter a password");
    setIsLoading(false);
    return;
  }

  try {
    if (isSignup) {
      // Signup logic
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      const signupData = {
        loginEmail: email ? email.toLowerCase().trim() : "",
        firstName: firstName || "",
        lastName: lastName || "",
        password: password,
        phoneNumber: phone || "",
        languageCode: "rw", // Default language code
        id: "", // Empty as per new payload
        phoneCountryCode: phone ? {
          code: selectedCountry.code,
          country: selectedCountry.country,
          id: selectedCountry.id
        } : undefined
      };

      console.log("Sending signup data:", signupData);

      const response = await fetch("https://blaise0781.wixstudio.com/house-rent/_functions/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      console.log("Signup response:", result);

      // Check for success based on statusCode
      if (response.ok && result.statusCode === 200) {
        console.log("Signup successful:", result);
        // Store user data in localStorage
        if (result.details) {
          localStorage.setItem("user", JSON.stringify(result.details));
        }
        window.location.href = redirectTo;
      } else {
        // Handle error from backend
        setError(result.message || "Signup failed. Please try again.");
      }
    } else {
      // Login logic
      const loginData = {
        password: password,
        loginEmail: email ? email.toLowerCase().trim() : "",
        phoneNumber: phone ? `${selectedCountry.code}${phone}` : "",
        languageCode: "rw" // Default language code
      };

      console.log("Sending login data:", loginData);

      const response = await fetch("https://blaise0781.wixstudio.com/house-rent/_functions/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log("Login response:", result);

      // Check for success based on login flag and statusCode
      if (response.ok && result.login && result.statusCode === 200) {
        console.log("Login successful:", result.details);
        if (result.details) {
          localStorage.setItem("user", JSON.stringify(result.details));
        }
        window.location.href = redirectTo;
      } else {
        // Handle error from backend
        setError(result.message || getLoginErrorMessage(result.error));
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    setError("An error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

const getLoginErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "-19999":
      return "User not found. Please check your credentials or sign up.";
    case "-19976":
      return "Incorrect password. Please try again.";
    case "01":
      return "Email/phone and password are required.";
    default:
      return "Login failed. Please try again.";
  }
};

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setEmail("");
    setPassword("");
    setPhone("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setShowEmail(true);
    setShowPhone(true);
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry({
      ...country,
      country: country.country || country.title,
    });
    setShowCountryOverlay(false);
    setSearchQuery("");
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
      if (value.length > 0) {
        setShowPhone(false);
      } else {
        setShowPhone(true);
      }
    } else if (field === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setPhone(numericValue);
      if (numericValue.length > 0) {
        setShowEmail(false);
      } else {
        setShowEmail(true);
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setShowEmail(true);
    setShowPhone(true);
    setError("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Photo with Text Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://legacydrivingacademy.com/wp-content/uploads/2022/06/AdobeStock_287278818-scaled.jpeg"
            alt="Login background"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        {/* Text Overlay */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white max-w-lg">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg">
              <span className="text-primary-foreground font-bold text-2xl">Kora</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Kora
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Your trusted partner in finding the perfect home. Join thousands of satisfied tenants and landlords.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <span className="text-lg">Find your dream home</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <span className="text-lg">Secure and reliable</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <span className="text-lg">Easy payment process</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        {/* X Close Button - Top Right */}
        <Link href="/">
          <button className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className=" text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">K</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
             Kora
            </h2>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-3 text-center pt-8 pb-6">
              <h2 className="text-2xl font-bold">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground">
                {isSignup ? "Sign up to start your journey" : "Sign in to continue"}
              </p>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 p-3 text-sm text-destructive bg-destructive/15 rounded-md text-center" data-testid="auth-error">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={isSignup}
                        disabled={isLoading}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={isSignup}
                        disabled={isLoading}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                )}

                {showEmail && (
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required={!phone}
                      disabled={isLoading}
                      data-testid="input-email"
                    />
                  </div>
                )}

                {/* "Or" separator - only show when both fields are visible */}
                {showEmail && showPhone && (
                  <div className="text-center my-3 text-sm text-muted-foreground">
                    or
                  </div>
                )}

                {showPhone && (
                  <div className="flex space-x-2">
                    <div
                      className="flex items-center justify-between w-24 px-3 py-2 bg-muted border border-border rounded-md cursor-pointer"
                      onClick={() => setShowCountryOverlay(true)}
                    >
                      <img src={selectedCountry.image} alt={selectedCountry.title} className="w-6 h-5 object-cover mr-1 rounded-sm" />
                      <span className="text-foreground text-sm">{selectedCountry.code}</span>
                      <ChevronDown className="w-4 h-4 text-foreground ml-1" />
                    </div>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="flex-1"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required={!email}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    data-testid="input-password"
                    className="pr-10"
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>

                {isSignup && (
                  <>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={isSignup}
                        disabled={isLoading}
                        data-testid="input-confirm-password"
                        className="pr-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground px-2">
                      Password must be at least 6 characters long
                    </p>
                  </>
                )}

                <div className="text-center space-y-4">
                  {!isSignup && (
                    <div className="flex justify-between items-center gap-4">
                      <Link href="/forgot-password">
                        <Button type="button" variant="outline" className="flex-1" disabled={isLoading}>
                          Forgot Password?
                        </Button>
                      </Link>
                      <Button 
                        type="submit" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 flex items-center justify-center gap-2" 
                        disabled={isLoading}
                        data-testid="button-auth-submit"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                  )}

                  {isSignup && (
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2" 
                      disabled={isLoading}
                      data-testid="button-auth-submit"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  )}

                  {/* Toggle between Login and Signup */}
                  <div className="pt-4">
                    <p className="text-muted-foreground text-sm">
                      {isSignup ? "Already have an account?" : "Don't have an account?"}
                    </p>
                    <Button 
                      type="button" 
                      onClick={toggleMode} 
                      variant="outline" 
                      className="w-full mt-2"
                      disabled={isLoading}
                      data-testid="link-toggle-mode"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isSignup ? "Sign In" : "Sign Up"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Country Code Selection Overlay */}
      {showCountryOverlay && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowCountryOverlay(false); setSearchQuery(""); }} />

          {/* Bottom Sheet */}
          <div className="relative w-full bg-background rounded-t-xl animate-in slide-in-from-bottom duration-300 max-h-[60vh] flex flex-col">
            <div className="p-4 flex-shrink-0">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Select Country</h3>
                <button onClick={() => { setShowCountryOverlay(false); setSearchQuery(""); }} className="p-1 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search country" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-9 bg-muted border-0" 
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-grow">
              {filteredCountries.map((country) => (
                <div 
                  key={country.id} 
                  className={`flex items-center p-4 border-b border-border cursor-pointer hover:bg-muted ${selectedCountry.id === country.id ? "bg-muted" : ""}`} 
                  onClick={() => handleCountrySelect(country)}
                >
                  <img src={country.image} alt={country.title} className="w-8 h-6 object-cover mr-3 rounded-sm" />
                  <div className="flex-1">
                    <div className="text-foreground font-medium">{country.title}</div>
                  </div>
                  <span className="text-muted-foreground">{country.code}</span>
                </div>
              ))}

              {filteredCountries.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">No countries found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}