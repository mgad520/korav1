import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Clock } from "lucide-react";
import { Link } from "wouter";

export default function ResultsPage() {
  const [location] = useLocation();
  
  // Get data from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const dataParam = urlParams.get('data');
  
  let resultsData = null;
  try {
    resultsData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;
  } catch (e) {
    console.error('Error parsing results data:', e);
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p>No results data found.</p>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { questions, userAnswers, totalQuestions, timeSpent } = resultsData;

  // Calculate score
  const correctAnswers = questions.filter((question: any, index: number) => {
    const userAnswer = userAnswers[index];
    const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
    return userAnswer === correctChoice?.id;
  }).length;

  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= 80;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Results Summary */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className={`h-12 w-12 ${passed ? 'text-green-500' : 'text-red-500'} mr-3`} />
              <div>
                <h1 className="text-3xl font-bold">Exam Results</h1>
                <p className="text-muted-foreground">B2 Level Test</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{score}%</div>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {correctAnswers}/{totalQuestions}
                </div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  {formatTime(timeSpent)}
                </div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              passed 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {passed ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Passed - Congratulations!
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Failed - Keep practicing!
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Detailed Results</h2>
          
          {questions.map((question: any, index: number) => {
            const userAnswer = userAnswers[index];
            const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
            const userChoice = question.choices.find((choice: any) => choice.id === userAnswer);
            const isCorrect = userAnswer === correctChoice?.id;

            return (
              <Card key={question.id} className="border-2 border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold flex-1">
                      Question {index + 1}: {question.text}
                    </h3>
                    <div className={`ml-4 flex-shrink-0 ${
                      isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {question.choices.map((choice: any) => {
                      const isUserChoice = choice.id === userAnswer;
                      const isCorrectChoice = choice.isCorrect;
                      
                      let bgColor = "bg-background";
                      let borderColor = "border-border";
                      let textColor = "text-foreground";

                      if (isCorrectChoice) {
                        bgColor = "bg-green-50";
                        borderColor = "border-green-200";
                        textColor = "text-green-800";
                      } else if (isUserChoice && !isCorrectChoice) {
                        bgColor = "bg-red-50";
                        borderColor = "border-red-200";
                        textColor = "text-red-800";
                      }

                      return (
                        <div
                          key={choice.id}
                          className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                              isCorrectChoice 
                                ? 'bg-green-500 text-white border-green-500'
                                : isUserChoice && !isCorrectChoice
                                ? 'bg-red-500 text-white border-red-500'
                                : 'border-gray-300'
                            }`}>
                              {choice.id}
                            </div>
                            <span className="flex-1">{choice.text}</span>
                            {isCorrectChoice && (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                            {isUserChoice && !isCorrectChoice && (
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Take Another Test
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}