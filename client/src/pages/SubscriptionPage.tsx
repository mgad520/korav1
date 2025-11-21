// components/SubscriptionPage.tsx
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Check, X, Loader2, ChevronRight } from "lucide-react";
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

  // Mock data - replace with your actual data
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "edbd983f-5ad7-4f9e-aa3e-5573840afcb8",
      name: "Basic Pack",
      price: 500,
      currency: "RWF",
      period: "/ Week",
      description: "Perfect for getting started with basic features",
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
      period: "/ Week",
      description: "Most popular choice with enhanced features",
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
      period: "/ Week",
      description: "Ultimate experience with all features unlocked",
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


  // Duration plans calculation (simplified)
  const calculateDurationPlans = (plan: SubscriptionPlan) => {
    const weeks: DurationPlan[] = Array.from({ length: 3 }, (_, i) => {
      const weekCount = i + 1;
      const total = weekCount * plan.price;
      return {
        id: `week-${weekCount}`,
        name: `${weekCount} Week${weekCount > 1 ? 's' : ''}`,
        price: total,
        periodNumber: weekCount,
        periodName: "Week",
        planName: plan.name,
        priceInFull: `${total.toLocaleString()} ${plan.currency || 'RWF'}`,
      };
    });

    const months: DurationPlan[] = Array.from({ length: 12 }, (_, i) => {
      const monthCount = i + 1;
      const baseMonthPrice = plan.price * 4; // Approximate month as 4 weeks
      const totalPrice = monthCount * baseMonthPrice;
      
      return {
        id: `month-${monthCount}`,
        name: `${monthCount} Month${monthCount > 1 ? 's' : ''}`,
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
          // Include the full user object for backward compatibility
          ...parsedUser
        };
      }
      
      // Fallback to individual keys if user object doesn't exist
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
        setError("Please select a plan and duration");
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
          setPaymentStatusMessage("Please enter the OTP sent to your phone");
        } else {
          // Initialize WebSocket connection for payment tracking
          initializeWebSocket(user.id);
          setPaymentStatusMessage("Payment processing...");
        }
      } else {
        throw new Error("Payment submission failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket initialization (simplified)
  const initializeWebSocket = (userId: string) => {
    // Simulate WebSocket connection
    setIsWebSocketConnected(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setIsPaymentCompleted(true);
      setPaymentStatusMessage("Payment completed successfully!");
    }, 3000);
  };

  // Render steps
  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600 mt-2">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {/* Plan Header */}
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

              {/* Features */}
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

              {/* Selection Indicator */}
              {selectedPlan === plan.id && (
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                  <Check className="h-4 w-4" />
                  Selected
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
            Continue to Payment
          </Button>
        </div>
      )}
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Select Payment Method</h1>
        <p className="text-gray-600 mt-2">Choose how you'd like to pay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-full mx-auto">
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
          Back
        </Button>
        {selectedPaymentMethod && (
          <Button
            onClick={() => setCurrentStep("duration")}
            className="bg-green-600 hover:bg-green-700"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );

  const renderDurationSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Select Duration</h1>
        <p className="text-gray-600 mt-2">Choose how long you want to subscribe</p>
      </div>

      {/* Weeks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Weekly Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {durationPlans.weeks.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedDuration === plan.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedDuration(plan.id)}
            >
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {plan.price.toLocaleString()} RWF
                </div>
                <p className="text-sm text-gray-600">{plan.planName}</p>
                {selectedDuration === plan.id && (
                  <Check className="h-5 w-5 text-green-500 mx-auto mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Months */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Monthly Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {durationPlans.months.slice(0, 8).map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedDuration === plan.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedDuration(plan.id)}
            >
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{plan.name}</h4>
                <div className="text-lg font-bold text-green-600 mb-1">
                  {plan.price.toLocaleString()} RWF
                </div>
                <p className="text-xs text-gray-600">{plan.planName}</p>
                {selectedDuration === plan.id && (
                  <Check className="h-4 w-4 text-green-500 mx-auto mt-1" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep("payment-method")}
        >
          Back
        </Button>
        {selectedDuration && (
          <Button
            onClick={() => setCurrentStep("confirmation")}
            className="bg-green-600 hover:bg-green-700"
          >
            Continue to Confirmation
          </Button>
        )}
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const selectedPlanData = subscriptionPlans.find(p => p.id === selectedPlan);
    const selectedDurationData = [...durationPlans.weeks, ...durationPlans.months].find(d => d.id === selectedDuration);

    if (!selectedPlanData || !selectedDurationData) {
      return <div>Error: Please select a plan and duration</div>;
    }

    const totalAmount = selectedDurationData.price;
    const isCardPayment = selectedPaymentMethod?.includes("visa");

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Confirm Your Subscription</h1>
          <p className="text-gray-600 mt-2">Review your selection and complete payment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{selectedPlanData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedDurationData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              
              {isPaymentCompleted ? (
                <div className="text-center py-8">
                  {paymentStatus === 'success' ? (
                    <div className="text-green-600">
                      <Check className="h-16 w-16 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Payment Successful!</h4>
                      <p className="text-gray-600">{paymentStatusMessage}</p>
                      <Button
                        onClick={() => setLocation("/konte")}
                        className="mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Go to Account
                      </Button>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <X className="h-16 w-16 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Payment Failed</h4>
                      <p className="text-gray-600">{paymentStatusMessage}</p>
                      <Button
                        onClick={() => setPaymentStatus('pending')}
                        className="mt-4"
                        variant="outline"
                      >
                        Try Again
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
                        Pay with Card
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!isInOtpPhase ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Enter your phone number"
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
                            Send Payment Request
                          </Button>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter OTP
                            </label>
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter OTP from your phone"
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
                            Confirm Payment
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
            Back
          </Button>
        </div>
      </div>
    );
  };

  // Progress indicator
  const steps = [
    { id: "plans", name: "Select Plan" },
    { id: "payment-method", name: "Payment Method" },
    { id: "duration", name: "Duration" },
    { id: "confirmation", name: "Confirmation" },
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
            Back to Account
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
    </div>
  );
}