import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle, Trophy, AlertCircle } from "lucide-react";

interface ResultCardProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  passingPercentage?: number;
  timeTaken?: string;
}

export default function ResultCard({
  score,
  totalQuestions,
  percentage,
  passingPercentage = 80,
  timeTaken,
}: ResultCardProps) {
  const passed = percentage >= passingPercentage;

  return (
    <Card className="w-full" data-testid="card-result">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="mx-auto">
          {passed ? (
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-2" data-testid="text-result-status">
            {passed ? "Congratulations! You Passed!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground">
            {passed
              ? "You've successfully completed this exam"
              : "You need 80% to pass. Review the explanations and try again."}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Your Score</p>
            <p className="text-3xl font-bold" data-testid="text-score">
              {score}/{totalQuestions}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Percentage</p>
            <p className="text-3xl font-bold" data-testid="text-percentage">
              {percentage}%
            </p>
          </div>
        </div>

        {timeTaken && (
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Time Taken</p>
            <p className="text-xl font-semibold" data-testid="text-time-taken">{timeTaken}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Correct Answers
            </span>
            <span className="font-medium">{score}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              Incorrect Answers
            </span>
            <span className="font-medium">{totalQuestions - score}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
