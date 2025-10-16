import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProgressCard from "@/components/ProgressCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar } from "lucide-react";

export default function AccountPage() {
  //todo: remove mock functionality
  const user = {
    name: "Jean Baptiste",
    email: "jean.baptiste@example.com",
    subscription: "Free",
  };

  const attempts = [
    {
      id: 1,
      date: "2024-01-15",
      score: 34,
      total: 40,
      passed: true,
      duration: "38 min",
    },
    {
      id: 2,
      date: "2024-01-14",
      score: 28,
      total: 40,
      passed: false,
      duration: "42 min",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold" data-testid="text-user-name">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      {user.subscription} Plan
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <ProgressCard
              title="Weekly Progress"
              stats={{
                totalAttempts: 12,
                passRate: 75,
                averageScore: 82,
                studyTime: 8,
              }}
            />

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Attempt History</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                      data-testid={`card-attempt-${attempt.id}`}
                    >
                      <div className="flex items-center gap-3">
                        {attempt.passed ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium">
                            Score: {attempt.score}/{attempt.total} ({Math.round((attempt.score / attempt.total) * 100)}%)
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{attempt.date}</span>
                            <span>•</span>
                            <span>{attempt.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" data-testid={`button-review-${attempt.id}`}>
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <SubscriptionCard
              title="Monthly"
              price={6000}
              duration="per month"
              features={[
                "Unlimited mock exams",
                "All modules unlocked",
                "Progress tracking",
                "Weekly reports",
              ]}
              isPopular={true}
              onSubscribe={() => console.log("Subscribe clicked")}
            />

            <SubscriptionCard
              title="Weekly"
              price={2000}
              duration="per week"
              features={[
                "Unlimited mock exams",
                "All modules unlocked",
                "Progress tracking",
              ]}
              onSubscribe={() => console.log("Subscribe clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
