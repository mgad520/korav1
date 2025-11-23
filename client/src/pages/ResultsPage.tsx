import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function ResultsPage() {
  //todo: remove mock functionality
  const result = {
    score: 34,
    totalQuestions: 40,
    percentage: 85,
    timeTaken: "38 minutes",
  };

  const questionReview = [
    {
      id: 1,
      text: "What does a STOP sign require you to do?",
      yourAnswer: "Stop and give way to all traffic",
      correctAnswer: "Stop and give way to all traffic",
      isCorrect: true,
      explanation: "A STOP sign requires a complete stop and giving way to all traffic.",
    },
    {
      id: 2,
      text: "What is the speed limit in urban areas?",
      yourAnswer: "60 km/h",
      correctAnswer: "40 km/h",
      isCorrect: false,
      explanation: "The speed limit in urban areas in Rwanda is 40 km/h.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-0">
        <div className="space-y-8">
          <ResultCard
            score={result.score}
            totalQuestions={result.totalQuestions}
            percentage={result.percentage}
            timeTaken={result.timeTaken}
          />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Answers</h3>
            <Accordion type="single" collapsible className="w-full">
              {questionReview.map((question) => (
                <AccordionItem key={question.id} value={`question-${question.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                      <span>Question {question.id}: {question.text}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2 pl-8">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Your Answer:</p>
                        <p className={question.isCorrect ? "text-primary" : "text-destructive"}>
                          {question.yourAnswer}
                        </p>
                      </div>
                      {!question.isCorrect && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Correct Answer:</p>
                          <p className="text-primary">{question.correctAnswer}</p>
                        </div>
                      )}
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="flex gap-4">
            <Link href="/ibibazo" className="flex-1">
              <Button className="w-full" data-testid="button-try-again">
                Try Another Quiz
              </Button>
            </Link>
            <Link href="/konte" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="button-view-progress">
                View Progress
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
