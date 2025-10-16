import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

interface ProgressCardProps {
  title: string;
  stats: {
    totalAttempts: number;
    passRate: number;
    averageScore: number;
    studyTime: number;
  };
}

export default function ProgressCard({ title, stats }: ProgressCardProps) {
  return (
    <Card data-testid="card-progress">
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Total Attempts</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-attempts">{stats.totalAttempts}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Pass Rate</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-pass-rate">{stats.passRate}%</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Avg. Score</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-avg-score">{stats.averageScore}%</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Study Time</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-study-time">{stats.studyTime}h</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{stats.averageScore}%</span>
          </div>
          <Progress value={stats.averageScore} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
