import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

interface SubscriptionCardProps {
  title: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
  onSubscribe?: () => void;
}

export default function SubscriptionCard({
  title,
  price,
  duration,
  features,
  isPopular = false,
  onSubscribe,
}: SubscriptionCardProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isPopular ? "ring-2 ring-primary shadow-xl scale-105" : "hover-elevate"
      }`}
      data-testid={`card-subscription-${title.toLowerCase()}`}
    >
      {isPopular && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-bl-lg">
            <Sparkles className="h-3.5 w-3.5" />
            Most Popular
          </div>
        </>
      )}

      <CardHeader className="text-center space-y-3 pt-10 pb-6">
        <h3 className="text-2xl md:text-3xl font-bold" data-testid={`text-plan-${title.toLowerCase()}`}>{title}</h3>
        <div className="space-y-1">
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            RWF {price.toLocaleString()}
          </p>
          <p className="text-sm md:text-base text-muted-foreground font-medium">{duration}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm md:text-base leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className="w-full font-semibold"
          size="lg"
          variant={isPopular ? "default" : "outline"}
          onClick={onSubscribe}
          data-testid={`button-subscribe-${title.toLowerCase()}`}
        >
          Subscribe with MTN MoMo
        </Button>
      </CardFooter>
    </Card>
  );
}
