import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import QuizTimer from "@/components/QuizTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import trafficSignsImage from "@assets/generated_images/Traffic_signs_module_thumbnail_8024bdd3.png";
import { Link } from "wouter";

export default function QuizzesPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMockMode, setIsMockMode] = useState(false);

  //todo: remove mock functionality
  const questions = [
    {
      id: "1",
      text: "What does this traffic sign indicate?",
      image: trafficSignsImage,
      choices: [
        { id: "1", text: "Stop and give way to all traffic", isCorrect: true },
        { id: "2", text: "Slow down and proceed with caution", isCorrect: false },
        { id: "3", text: "No entry for all vehicles", isCorrect: false },
        { id: "4", text: "Parking is prohibited", isCorrect: false },
      ],
      explanation: "This is a STOP sign. You must come to a complete stop and give way to all traffic before proceeding.",
    },
  ];

  const handleStartQuiz = (mode: "practice" | "mock") => {
    setIsMockMode(mode === "mock");
    setQuizStarted(true);
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {isMockMode && quizStarted && (
        <QuizTimer totalSeconds={2700} onTimeUp={() => console.log("Time up!")} />
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            ← Back to Home
          </Button>
        </Link>

        {!quizStarted ? (
          <Tabs defaultValue="practice" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice" data-testid="tab-practice">Practice Mode</TabsTrigger>
              <TabsTrigger value="mock" data-testid="tab-mock">Mock Exam</TabsTrigger>
            </TabsList>

            <TabsContent value="practice" className="mt-6">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Practice Quiz</h2>
                  <p className="text-muted-foreground">
                    Get immediate feedback for each question. Perfect for learning!
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Immediate feedback after each answer</li>
                    <li>• Explanations for correct answers</li>
                    <li>• No time limit</li>
                    <li>• Track your progress</li>
                  </ul>
                  <Button
                    onClick={() => handleStartQuiz("practice")}
                    className="w-full"
                    data-testid="button-start-practice"
                  >
                    Start Practice Quiz
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mock" className="mt-6">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Mock Exam</h2>
                  <p className="text-muted-foreground">
                    Simulate the real driving theory exam experience
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li>• 40 randomized questions</li>
                    <li>• 45 minutes time limit</li>
                    <li>• 80% passing score required</li>
                    <li>• Detailed results at the end</li>
                  </ul>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-primary">
                      🔒 Premium subscribers only
                    </p>
                  </div>
                  <Button
                    onClick={() => handleStartQuiz("mock")}
                    className="w-full"
                    data-testid="button-start-mock"
                  >
                    Start Mock Exam
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <QuizCard
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              questionText={questions[currentQuestion].text}
              questionImage={questions[currentQuestion].image}
              choices={questions[currentQuestion].choices}
              showFeedback={!isMockMode}
              explanation={questions[currentQuestion].explanation}
              onAnswer={(choiceId, isCorrect) => {
                console.log("Answer:", choiceId, "Correct:", isCorrect);
              }}
            />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                data-testid="button-previous"
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion((prev) => prev + 1);
                  } else {
                    console.log("Quiz complete!");
                  }
                }}
                data-testid="button-next"
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
