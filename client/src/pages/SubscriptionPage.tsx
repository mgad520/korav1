import SubscriptionCard from "@/components/SubscriptionCard";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <Link href="/konte">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Button>
        </Link>

        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unlock unlimited mock exams and accelerate your learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <SubscriptionCard
            title="Weekly"
            price={2000}
            duration="per week"
            features={[
              "Unlimited mock exams",
              "All 8 modules unlocked",
              "Progress tracking",
              "Image-based questions",
            ]}
            onSubscribe={() => console.log("Weekly subscription clicked")}
          />

          <SubscriptionCard
            title="Monthly"
            price={6000}
            duration="per month"
            features={[
              "Unlimited mock exams",
              "All 8 modules unlocked",
              "Progress tracking",
              "Weekly progress reports",
              "Priority support",
            ]}
            isPopular={true}
            onSubscribe={() => console.log("Monthly subscription clicked")}
          />
        </div>

        <div className="bg-card rounded-xl border p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-6">What's Included:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Unlimited Practice</p>
                <p className="text-sm text-muted-foreground">Take as many mock exams as you need</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">All Modules</p>
                <p className="text-sm text-muted-foreground">Access to all 8 comprehensive modules</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Track Progress</p>
                <p className="text-sm text-muted-foreground">Monitor your improvement over time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Secure Payments</p>
                <p className="text-sm text-muted-foreground">Pay safely with MTN Mobile Money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
