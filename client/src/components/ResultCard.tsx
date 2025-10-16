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
    <Card className="w-full overflow-hidden" data-testid="card-result">
      <div className={`absolute inset-0 opacity-5 ${passed ? 'bg-gradient-to-br from-primary to-primary/50' : 'bg-gradient-to-br from-destructive to-destructive/50'}`} />
      
      <CardHeader className="text-center space-y-6 pb-8 pt-12 relative">
        <div className="mx-auto">
          {passed ? (
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-xl">
              <Trophy className="h-14 w-14 md:h-16 md:w-16 text-primary" />
            </div>
          ) : (
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shadow-xl">
              <AlertCircle className="h-14 w-14 md:h-16 md:w-16 text-destructive" />
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-result-status">
            {passed ? "Congratulations! You Passed!" : "Keep Practicing!"}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
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
