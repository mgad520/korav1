import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ZoomIn } from "lucide-react";
import { useState } from "react";

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  questionImage?: string;
  choices: Choice[];
  onAnswer?: (choiceId: string, isCorrect: boolean) => void;
  showFeedback?: boolean;
  selectedAnswer?: string;
  isReview?: boolean;
  explanation?: string;
}

export default function QuizCard({
  questionNumber,
  totalQuestions,
  questionText,
  questionImage,
  choices,
  onAnswer,
  showFeedback = false,
  selectedAnswer,
  isReview = false,
  explanation,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string>(selectedAnswer || "");
  const [showImageZoom, setShowImageZoom] = useState(false);

  const handleSelect = (choiceId: string) => {
    setSelected(choiceId);
    const choice = choices.find((c) => c.id === choiceId);
    if (onAnswer && choice) {
      onAnswer(choiceId, choice.isCorrect);
    }
  };

  const getChoiceVariant = (choice: Choice) => {
    if (!showFeedback && !isReview) return "outline";
    if (choice.id === selected) {
      return choice.isCorrect ? "default" : "destructive";
    }
    if (choice.isCorrect && isReview) return "default";
    return "outline";
  };

  return (
    <Card className="w-full" data-testid={`card-question-${questionNumber}`}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {questionImage && (
          <div className="relative group">
            <img
              src={questionImage}
              alt="Question illustration"
              className="w-full rounded-lg object-contain max-h-64 bg-muted"
              data-testid={`img-question-${questionNumber}`}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowImageZoom(true)}
              data-testid="button-zoom-image"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        )}

        <h3 className="text-lg font-semibold" data-testid={`text-question-${questionNumber}`}>
          {questionText}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup value={selected} onValueChange={handleSelect}>
          <div className="space-y-3">
            {choices.map((choice) => (
              <div
                key={choice.id}
                className={`relative rounded-lg border-2 p-4 transition-all ${
                  selected === choice.id
                    ? showFeedback || isReview
                      ? choice.isCorrect
                        ? "border-primary bg-primary/5"
                        : "border-destructive bg-destructive/5"
                      : "border-primary bg-primary/5"
                    : "border-border hover-elevate"
                }`}
                data-testid={`choice-${choice.id}`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={choice.id} id={choice.id} />
                  <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                    {choice.text}
                  </Label>
                  {(showFeedback || isReview) && selected === choice.id && (
                    <>
                      {choice.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        {(showFeedback || isReview) && explanation && (
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{explanation}</p>
          </div>
        )}
      </CardContent>

      {showImageZoom && questionImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImageZoom(false)}
        >
          <img
            src={questionImage}
            alt="Question illustration zoomed"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </Card>
  );
}
