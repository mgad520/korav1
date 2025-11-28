// components/SubscriptionPage.tsx
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Check, X, Loader2, ChevronRight, X as XIcon } from "lucide-react";
import { FaCreditCard } from "react-icons/fa";

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency?: string;
  period: string;
  description: string;
  features: { name: string; included: boolean }[];
}

interface DurationPlan {
  id: string;
  name: string;
  price: number;
  periodNumber: number;
  periodName: string;
  planName: string;
  priceInFull: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  image: string;
}

type Step = "plans" | "payment-method" | "duration" | "confirmation";

export default function SubscriptionPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isInOtpPhase, setIsInOtpPhase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment states
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string | null>(null);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  // Mobile overlay states
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [showDurationOverlay, setShowDurationOverlay] = useState(false);
  const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);
  const [tempSelectedPaymentMethod, setTempSelectedPaymentMethod] = useState<string | null>(null);
  const [tempSelectedDuration, setTempSelectedDuration] = useState<string | null>(null);

  // Mock data - replace with your actual data
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "edbd983f-5ad7-4f9e-aa3e-5573840afcb8",
      name: "Basic Pack",
      price: 500,
      currency: "RWF",
      period: "/ Icyumweru",
      description: "Iki nibyiza ubabona mugishe muganze iri fatabuguzi",
      features: [
        { name: "Ibizamini Byose", included: true },
        { name: "Amasomo Yose", included: false },
        { name: "Kureba Video", included: false },
      ],
    },
    {
      id: "964170b9-6a25-4b44-8741-97bd72999106",
      name: "Classic Pack",
      price: 1000,
      currency: "RWF",
      period: "/ Icyumweru",
      description: "Iki nibyiza ubabona mugishe muganze iri fatabuguzi",
      features: [
        { name: "Ibizamini Byose", included: true },
        { name: "Amasomo Yose", included: true },
        { name: "Kureba Video", included: false },
      ],
    },
    {
      id: "14318a87-3bcf-4d45-ac8c-c62e4767ea9c",
      name: "Unique + Pack",
      price: 1500,
      currency: "RWF",
      period: "/ Icyumweru",
      description: "Iki nibyiza ubabona mugishe muganze iri fatabuguzi",
      features: [
        { name: "Ibizamini Byose", included: true },
        { name: "Amasomo Yose", included: true },
        { name: "Kureba Video", included: true },
      ],
    },
  ];

  const paymentMethods: PaymentMethod[] = [
        {
      id: "mtn-rw",
      name: "MTN | Airtel Rwanda",
      description: "Choose to pay with MTN | Airtel Rwanda",
      image: "https://flagcdn.com/w320/rw.png",
    },
    {
      id: "visa",
      name: "VISA & MasterCard",
      description: "Choose to Pay with VISA & MasterCard",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    },
    {
      id: "mtn-ug",
      name: "MTN | Airtel Uganda",
      description: "Choose to pay with MTN | Airtel Uganda",
      image: "https://flagcdn.com/w320/ug.png",
    },
    {
      id: "mpesa-ke",
      name: "MPESA Kenya",
      description: "Choose to pay with MPESA Kenya",
      image: "https://flagcdn.com/w320/ke.png",
    },
    {
      id: "mtn-zm",
      name: "MTN | AIRTEL | ZANTEL Zambia",
      description: "Choose to pay with MTN | AIRTEL | ZANTEL Zambia",
      image: "https://flagcdn.com/w320/zm.png",
    },
    {
      id: "lumicash",
      name: "LUMICASH || Ecocash Burundi",
      description: "Choose to pay with LUMICASH || Ecocash Burundi",
      image: "https://flagcdn.com/w320/bi.png",
    },
    {
      id: "airtel-drc",
      name: "AIRTEL | VODACOM ORANGE | DRC 2",
      description: "Choose to pay with AIRTEL | VODACOM ORANGE | DRC 2",
      image: "https://flagcdn.com/w320/cd.png",
    },
    {
      id: "vodacom-orange",
      name: "AIRTEL | VODACOM ORANGE | DRC franc",
      description: "Choose to pay with AIRTEL | VODACOM ORANGE | DRC Franc",
      image: "https://flagcdn.com/w320/cd.png",
    },
    {
      id: "mpesa-tz",
      name: "MPESA Tanzania",
      description: "Choose to pay with MPESA Tanzania",
      image: "https://flagcdn.com/w320/tz.png",
    },
    {
      id: "mtn-orange",
      name: "MTN | ORANGE",
      description: "Choose to pay with MTN | ORANGE",
      image: "https://flagcdn.com/w320/cm.png",
    },
  ];
  // Duration plans calculation
  const calculateDurationPlans = (plan: SubscriptionPlan) => {
    const weeks: DurationPlan[] = Array.from({ length: 3 }, (_, i) => {
      const weekCount = i + 1;
      const total = weekCount * plan.price;
      return {
        id: `week-${weekCount}`,
        name: `I${weekCount > 1 ? "b" : "c"}yumweru ${weekCount}`,
        price: total,
        periodNumber: weekCount,
        periodName: "Week",
        planName: plan.name,
        priceInFull: `${total.toLocaleString()} ${plan.currency || 'RWF'}`,
      };
    });

    const months: DurationPlan[] = Array.from({ length: 12 }, (_, i) => {
      const monthCount = i + 1;
      const baseMonthPrice = plan.price * 4;
      const totalPrice = monthCount * baseMonthPrice;
      
      return {
        id: `month-${monthCount}`,
        name: `${monthCount > 1 ? "Am" : "Ukw"}ezi ${monthCount}`,
        price: totalPrice,
        periodNumber: monthCount,
        periodName: "Month",
        planName: plan.name,
        priceInFull: `${totalPrice.toLocaleString()} ${plan.currency || 'RWF'}`,
      };
    });

    return { weeks, months };
  };

  const [durationPlans, setDurationPlans] = useState<{ weeks: DurationPlan[]; months: DurationPlan[] }>({ weeks: [], months: [] });

  useEffect(() => {
    if (selectedPlan) {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (plan) {
        setDurationPlans(calculateDurationPlans(plan));
      }
    }
  }, [selectedPlan]);

  // Mobile overlay management
  useEffect(() => {
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      setShowPaymentOverlay(currentStep === "payment-method");
      setShowDurationOverlay(currentStep === "duration");
      setShowConfirmationOverlay(currentStep === "confirmation");
    } else {
      setShowPaymentOverlay(false);
      setShowDurationOverlay(false);
      setShowConfirmationOverlay(false);
    }
  }, [currentStep]);

  // When overlays open, initialize temp selections
  useEffect(() => {
    if (showPaymentOverlay) {
      setTempSelectedPaymentMethod(selectedPaymentMethod);
    }
    if (showDurationOverlay) {
      setTempSelectedDuration(selectedDuration);
    }
  }, [showPaymentOverlay, showDurationOverlay, selectedPaymentMethod, selectedDuration]);

  // Helper function to read user data
  const readUserFromLocalStorage = () => {
    try {
      if (typeof window === "undefined") return {};
      
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return {
          id: parsedUser._id || undefined,
          loginEmail: parsedUser.loginEmail || undefined,
          phone: parsedUser.phoneNumber || undefined,
          phoneCountryCode: parsedUser.phoneCountryCode || undefined,
          firstName: parsedUser.firstName || undefined,
          lastName: parsedUser.lastName || undefined,
          owner: parsedUser._owner || undefined,
          createdDate: parsedUser._createdDate || undefined,
          updatedDate: parsedUser._updatedDate || undefined,
          ...parsedUser
        };
      }
      
      return {
        id: localStorage.getItem("id") || undefined,
        loginEmail: localStorage.getItem("loginEmail") || undefined,
        phone: localStorage.getItem("phone") || localStorage.getItem("phoneNumber") || undefined,
      };
    } catch (error) {
      console.error("Error reading user data:", error);
      return {};
    }
  };

  // Payment submission
  const handleSubmitPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = readUserFromLocalStorage();
      const selectedPlanData = subscriptionPlans.find(p => p.id === selectedPlan);
      const selectedDurationData = [...durationPlans.weeks, ...durationPlans.months].find(d => d.id === selectedDuration);

      if (!selectedPlanData || !selectedDurationData) {
        setError("Hitamo ifatabuguzi n'igihe mbere yo gukomeza");
        return;
      }

      const payload = {
        id: user.id,
        planId: selectedPlan,
        amount: selectedDurationData.price,
        currency: selectedPlanData.currency || "RWF",
        email: user.loginEmail || "",
        languageCode: "rn",
        otp: isInOtpPhase ? otp : "",
        paymentGateway: "Afripay",
        paymentType: selectedPaymentMethod?.includes("visa") ? "card" : "mobile",
        period: selectedDurationData.periodNumber.toString(),
        periodName: selectedDurationData.periodName,
        phoneNumber: phoneNumber || user.phone || "",
      };

      // Simulate API call - replace with your actual endpoint
      const response = await fetch("https://dataapis.wixsite.com/kora/_functions/paymentData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.requiresOtp || result.isOtpPhase) {
          setIsInOtpPhase(true);
          setPaymentStatusMessage("Shyiramo OTP wakiriye kuri telefone");
        } else {
          // Initialize WebSocket connection for payment tracking
          initializeWebSocket(user.id);
          setPaymentStatusMessage("Ubwishyu burengeje...");
        }
      } else {
        throw new Error("Ubwishyu bwanzwe");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ubwishyu bwanzwe");
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket initialization (simplified)
  const initializeWebSocket = (userId: string) => {
    setIsWebSocketConnected(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setIsPaymentCompleted(true);
      setPaymentStatusMessage("Ubwishyu bwakiriwe neza!");
    }, 3000);
  };

  // Reset payment states
  const resetPaymentStates = () => {
    setPaymentStatusMessage(null);
    setPaymentStatus('pending');
    setIsPaymentCompleted(false);
    setError(null);
    setIsInOtpPhase(false);
    setOtp("");
  };

  // Mobile Overlay Components
  const renderMobilePaymentOverlay = () => (
    <div className="fixed inset-0 z-50 sm:hidden flex items-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowPaymentOverlay(false)}
      />

      <div className="relative bg-[#1c1c1c] w-full rounded-t-2xl max-h-[60vh] flex flex-col shadow-2xl z-50">
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-500 rounded-full" />
        </div>

        <div className="px-4 pb-2 text-center">
          <h3 className="text-white font-medium text-base">Hitamo Uburyo Bwo Kwishyura</h3>
          <p className="text-gray-400 text-xs">Kanda kuri serivisi wishaka gukoresha</p>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setTempSelectedPaymentMethod(method.id)}
                className={`w-full flex items-center justify-between rounded-lg px-4 py-3 border ${
                  tempSelectedPaymentMethod === method.id
                    ? "border-green-500 bg-green-600/20"
                    : "border-gray-600 bg-[#2a2a2a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={method.image}
                    alt={method.name}
                    className="w-8 h-6 object-contain rounded-sm"
                  />
                  <span className="text-sm text-white font-medium">
                    {method.name}
                  </span>
                </div>

                {tempSelectedPaymentMethod === method.id ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-500" />
                )}
              </button>
            ))}

            <div className="h-6" />
          </div>

          <div className="sticky bottom-0 w-full p-4 bg-[#1c1c1c] border-t border-gray-700">
            <Button
              type="button"
              onClick={() => {
                setShowPaymentOverlay(false);
                if (tempSelectedPaymentMethod) {
                  setSelectedPaymentMethod(tempSelectedPaymentMethod);
                  setCurrentStep("duration");
                }
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg"
            >
              Komeza
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileDurationOverlay = () => (
    <div className="fixed inset-0 z-50 sm:hidden flex items-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowDurationOverlay(false)}
      />

      <div className="relative bg-[#1c1c1c] w-full rounded-t-2xl max-h-[60vh] flex flex-col shadow-2xl z-50">
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-500 rounded-full" />
        </div>

        <div className="px-4 pb-2 text-center">
          <h3 className="text-white font-medium text-base">Hitamo Igihe</h3>
          <p className="text-gray-400 text-xs">Kanda kuri icyumweru cyangwa amezi wishaka</p>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4">
            {/* Icyumweru Section */}
            <div>
              <h4 className="text-green-200 text-lg font-medium mb-3 text-center">Icyumweru</h4>
              <div className="space-y-2">
                {durationPlans.weeks.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setTempSelectedDuration(plan.id)}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 border ${
                      tempSelectedDuration === plan.id
                        ? "border-green-500 bg-green-600/20"
                        : "border-gray-600 bg-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white font-medium">
                        {plan.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400">
                        {plan.price.toLocaleString()} RWF
                      </span>
                      {tempSelectedDuration === plan.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amezi Section */}
            <div>
              <h4 className="text-green-200 text-lg font-medium mb-3 text-center">Amezi</h4>
              <div className="space-y-2">
                {durationPlans.months.slice(0, 6).map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setTempSelectedDuration(plan.id)}
                    className={`w-full flex items-center justify-between rounded-lg px-4 py-3 border ${
                      tempSelectedDuration === plan.id
                        ? "border-green-500 bg-green-600/20"
                        : "border-gray-600 bg-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white font-medium">
                        {plan.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400">
                        {plan.price.toLocaleString()} RWF
                      </span>
                      {tempSelectedDuration === plan.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-20" />
          </div>

          <div className="sticky bottom-0 w-full p-4 bg-[#1c1c1c] border-t border-gray-700">
            <Button
              type="button"
              onClick={() => {
                setShowDurationOverlay(false);
                if (tempSelectedDuration) {
                  setSelectedDuration(tempSelectedDuration);
                  setCurrentStep("confirmation");
                }
              }}
              disabled={!tempSelectedDuration}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg py-3 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Komeza
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

 const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hitamo Ifatabuguzi</h1>
        <p className="text-gray-600 mt-2">Hitamo ifatabuguzi rikwiye ibyo ushaka</p>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-6 sm:hidden mb-12">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative py-3 cursor-pointer transition-all rounded-xl border shadow-md ${
              selectedPlan === plan.id
                ? "border-green-500"
                : "border-green-500"
            }`}
          >
            {/* Floating Header Box */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-4">
              <div
                className={`px-2 py-3 text-xs font-semibold border rounded-md ${
                  selectedPlan === plan.id
                    ? "bg-green-600 text-black border-green-500"
                    : "bg-green-600 text-black border-green-500"
                }`}
              >
                Icyumweru / Amezi
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3 rounded-xl">
              {/* Title + Price + Features */}
              <div className="flex justify-between items-start gap-4">
                {/* Left side: title + price */}
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {plan.name}
                  </h3>
                  <div className="text-sm text-muted-foreground mb-2">
                    {plan.currency}
                  </div>
                  <div className="text-green-400 text-3xl font-bold">
                    {plan.price}
                  </div>
                </div>

                {/* Right side: features */}
                <ul className="space-y-1">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-200"
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <XIcon className="w-4 h-4 text-gray-500" />
                      )}
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                  setCurrentStep("payment-method");
                }}
                className={`mt-2 w-full rounded-lg py-2 font-semibold ${
                  selectedPlan === plan.id
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-green-500 hover:bg-gray-600 text-black"
                }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Komeza
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedPlan === plan.id
                ? "border-green-500 bg-green-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Crown className={`h-8 w-8 mx-auto mb-3 ${
                  plan.id === "unique" ? "text-yellow-500" : 
                  plan.id === "classic" ? "text-blue-500" : "text-gray-400"
                }`} />
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300" />
                    )}
                    <span className={`text-sm ${
                      feature.included ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {selectedPlan === plan.id && (
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <div className="flex justify-center">
          <Button
            onClick={() => setCurrentStep("payment-method")}
            className="bg-green-600 hover:bg-green-700 px-8 py-2"
          >
            Komeza Kwishyura
          </Button>
        </div>
      )}
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hitamo Uburyo Bwo Kwishyura</h1>
        <p className="text-gray-600 mt-2">Hitamo uburyo wishaka kwishyura</p>
      </div>

      {/* Mobile - Show button to open overlay */}
      <div className="sm:hidden">
        <Button
          onClick={() => setShowPaymentOverlay(true)}
          className="w-full bg-green-600 hover:bg-green-700 py-3"
        >
          Hitamo Uburyo Bwo Kwishyura
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4 max-w-full mx-auto">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`bg-green-50 cursor-pointer transition-all border-2 h-32 flex flex-col ${
              selectedPaymentMethod === method.id
                ? "border-green-500 bg-green-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPaymentMethod(method.id)}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3">
                <img
                  src={method.image}
                  alt={method.name}
                  className="w-10 h-7 object-contain rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {method.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {method.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                {selectedPaymentMethod === method.id && (
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep("plans")}
        >
          Subira Inyuma
        </Button>
        {selectedPaymentMethod && (
          <Button
            onClick={() => setCurrentStep("duration")}
            className="bg-green-600 hover:bg-green-700"
          >
            Komeza
          </Button>
        )}
      </div>
    </div>
  );

  const renderDurationSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hitamo Igihe</h1>
        <p className="text-gray-600 mt-2">Hitamo igihe wishaka gukoresha ifatabuguzi</p>
      </div>

      {/* Mobile - Show button to open overlay */}
      <div className="sm:hidden">
        <Button
          onClick={() => setShowDurationOverlay(true)}
          className="w-full bg-green-600 hover:bg-green-700 py-3"
        >
          Hitamo Igihe
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block space-y-8">
      {/* Weeks */}
<div>
  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Ibyumweru</h3>
  <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4">
    {durationPlans.weeks.map((plan, index) => (
      <button
        key={plan.id}
        onClick={() => setSelectedDuration(plan.id)}
        className={`px-5 py-3 rounded-xl border-2 transition-colors flex justify-between items-center 
          w-full sm:w-72
          ${
            selectedDuration === plan.id
              ? "bg-green-50 text-green-700 border-green-500 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50/50"
          }`}
      >
        {/* Left: name */}
        <span
          className="font-medium"
        >
          {plan.name}
        </span>

        {/* Right: price + circle */}
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
          >
            {plan.price.toLocaleString()} RWF
          </span>
          <span
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
              ${
                selectedDuration === plan.id
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 bg-white"
              }`}
          >
            {selectedDuration === plan.id && (
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            )}
          </span>
        </div>
      </button>
    ))}
  </div>
</div>

{/* Months */}
<div>
  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Amezi</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {durationPlans.months.slice(0, 8).map((plan, index) => (
      <button
        key={plan.id}
        onClick={() => setSelectedDuration(plan.id)}
        className={`px-4 py-3 rounded-xl border-2 transition-colors flex justify-between items-center 
          ${
            selectedDuration === plan.id
              ? "bg-green-50 text-green-700 border-green-500 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50/50"
          }`}
      >
        {/* Left: name */}
        <span
          className="font-medium text-sm"
        >
          {plan.name}
        </span>

        {/* Right: price + circle */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold"
          >
            {plan.price.toLocaleString()} RWF
          </span>
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center 
              ${
                selectedDuration === plan.id
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 bg-white"
              }`}
          >
            {selectedDuration === plan.id && (
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            )}
          </span>
        </div>
      </button>
    ))}
  </div>
</div>
</div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep("payment-method")}
        >
          Subira Inyuma
        </Button>
        {selectedDuration && (
          <Button
            onClick={() => setCurrentStep("confirmation")}
            className="bg-green-600 hover:bg-green-700"
          >
            Komeza Kwemeza
          </Button>
        )}
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const selectedPlanData = subscriptionPlans.find(p => p.id === selectedPlan);
    const selectedDurationData = [...durationPlans.weeks, ...durationPlans.months].find(d => d.id === selectedDuration);

    if (!selectedPlanData || !selectedDurationData) {
      return <div>Ikosa: Hitamo ifatabuguzi n'igihe mbere yo gukomeza</div>;
    }

    const totalAmount = selectedDurationData.price;
    const isCardPayment = selectedPaymentMethod?.includes("visa");

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Emeza Ifatabuguzi</h1>
          <p className="text-gray-600 mt-2">Reba ibyo wahisemo hanyuma ukomeze kwishyura</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Incamake</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ifatabuguzi:</span>
                  <span className="font-semibold">{selectedPlanData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Igihe:</span>
                  <span className="font-semibold">{selectedDurationData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uburyo bwo kwishyura:</span>
                  <span className="font-semibold">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Igiteranyo:</span>
                    <span className="text-green-600">
                      {totalAmount.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amakuru Yo Kwishyura</h3>
              
              {isPaymentCompleted ? (
                <div className="text-center py-8">
                  {paymentStatus === 'success' ? (
                    <div className="text-green-600">
                      <Check className="h-16 w-16 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Ubwishyu Bwakiriwe!</h4>
                      <p className="text-gray-600">{paymentStatusMessage}</p>
                      <Button
                        onClick={() => setLocation("/konte")}
                        className="mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Genda Kuri Konte
                      </Button>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <X className="h-16 w-16 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Ubwishyu Bwanzwe</h4>
                      <p className="text-gray-600">{paymentStatusMessage}</p>
                      <Button
                        onClick={() => setPaymentStatus('pending')}
                        className="mt-4"
                        variant="outline"
                      >
                        Ongera Ugerageze
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {isCardPayment ? (
                    <div className="text-center py-4">
                      <FaCreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <Button
                        onClick={handleSubmitPayment}
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Ishura Ukoresheje Ikarita
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!isInOtpPhase ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nimero ya Telefone
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Shyiramo numero yawe ya telefone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <Button
                            onClick={handleSubmitPayment}
                            disabled={!phoneNumber || isLoading}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Ohereza Ubwishyu
                          </Button>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Shyiramo OTP
                            </label>
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Shyiramo OTP wakiriye kuri telefone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg"
                            />
                          </div>
                          <Button
                            onClick={handleSubmitPayment}
                            disabled={!otp || isLoading}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Emeza Ubwishyu
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep("duration")}
          >
            Subira Inyuma
          </Button>
        </div>
      </div>
    );
  };

  // Progress indicator
  const steps = [
    { id: "plans", name: "Hitamo Ifatabuguzi" },
    { id: "payment-method", name: "Uburyo Bwo Kwishyura" },
    { id: "duration", name: "Igihe" },
    { id: "confirmation", name: "Kwemeza" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/konte")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Subira Kuri Konte
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  steps.findIndex(s => s.id === currentStep) >= index 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    steps.findIndex(s => s.id === currentStep) >= index
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    steps.findIndex(s => s.id === currentStep) > index 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {currentStep === "plans" && renderPlanSelection()}
          {currentStep === "payment-method" && renderPaymentMethod()}
          {currentStep === "duration" && renderDurationSelection()}
          {currentStep === "confirmation" && renderConfirmation()}
        </div>
      </div>

      {/* Mobile Overlays */}
      {showPaymentOverlay && renderMobilePaymentOverlay()}
      {showDurationOverlay && renderMobileDurationOverlay()}
    </div>
  );
}