import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen } from "lucide-react";

interface LessonViewerProps {
  title: string;
  content: string;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
  onTryQuiz?: () => void;
}

export default function LessonViewer({
  title,
  content,
  isCompleted = false,
  onMarkComplete,
  onTryQuiz,
}: LessonViewerProps) {
  return (
    <Card className="w-full" data-testid="card-lesson">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold" data-testid="text-lesson-title">{title}</h2>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          data-testid="text-lesson-content"
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {!isCompleted && (
            <Button onClick={onMarkComplete} variant="outline" className="gap-2" data-testid="button-mark-complete">
              <CheckCircle className="h-4 w-4" />
              Mark as Complete
            </Button>
          )}
          <Button onClick={onTryQuiz} className="gap-2" data-testid="button-try-quiz">
            Try Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
