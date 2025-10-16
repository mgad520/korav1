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
      className={`relative overflow-hidden ${
        isPopular ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      data-testid={`card-subscription-${title.toLowerCase()}`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Most Popular
        </div>
      )}

      <CardHeader className="text-center space-y-2 pt-8">
        <h3 className="text-2xl font-bold" data-testid={`text-plan-${title.toLowerCase()}`}>{title}</h3>
        <div className="space-y-1">
          <p className="text-4xl font-bold">
            RWF {price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
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
