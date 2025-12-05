import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, ArrowLeft, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

interface AnswerResult {
  answer: string;
  isCorrect: boolean;
}

interface QuestionResult {
  id: number;
  text: string;
  imageUrl?: string;
  explanation: string;
  choices: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

interface ResultsData {
  questions: QuestionResult[];
  userAnswers: { [key: number]: AnswerResult };
  totalQuestions: number;
  timeSpent: number;
  quizTitle: string;
  score: number;
  correctAnswers: number;
}

export default function ResultsPage() {
  const [location] = useLocation();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse data from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const dataParam = searchParams.get('data');
    
    if (dataParam) {
      try {
        const parsedData: ResultsData = JSON.parse(decodeURIComponent(dataParam));
        console.log("Results data received:", parsedData);
        setResultsData(parsedData);
        
        // Verify the data
        console.log("Quiz Title:", parsedData.quizTitle);
        console.log("Score:", parsedData.score);
        console.log("Correct Answers:", parsedData.correctAnswers);
        console.log("Total Questions:", parsedData.totalQuestions);
        console.log("Number of user answers:", Object.keys(parsedData.userAnswers || {}).length);
        
      } catch (error) {
        console.error("Error parsing results data:", error);
      }
    }
    setLoading(false);
  }, []);

  // Format time from seconds to minutes
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds} seconds`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds > 0 ? `${remainingSeconds} seconds` : ''}`;
  };

  // Get correct answer text for a question
  const getCorrectAnswerText = (question: QuestionResult) => {
    const correctChoice = question.choices.find(choice => choice.isCorrect === true);
    return correctChoice ? correctChoice.text : "Unknown";
  };

  // Get user's selected answer text
  const getUserAnswerText = (questionIndex: number) => {
    if (!resultsData?.userAnswers[questionIndex]) return "Not answered";
    
    const userAnswerId = resultsData.userAnswers[questionIndex].answer;
    const question = resultsData.questions[questionIndex];
    const selectedChoice = question.choices.find(choice => choice.id === userAnswerId);
    return selectedChoice ? selectedChoice.text : "Unknown";
  };

  // Prepare question review data from results
  const getQuestionReview = () => {
    if (!resultsData) return [];
    
    return resultsData.questions.map((question, index) => {
      const userAnswer = resultsData.userAnswers[index];
      const isCorrect = userAnswer?.isCorrect === true;
      
      return {
        id: index + 1,
        text: question.text,
        yourAnswer: getUserAnswerText(index),
        correctAnswer: getCorrectAnswerText(question),
        isCorrect: isCorrect,
        explanation: question.explanation || "No explanation available."
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-destructive">No Results Data Found</h1>
            <p className="text-muted-foreground">
              It seems the results data wasn't properly passed. Please take a quiz first.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/ibibazo">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Quizzes
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questionReview = getQuestionReview();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Quiz Results: {resultsData.quizTitle}
            </h1>
            <p className="text-center text-muted-foreground">
              You completed {resultsData.totalQuestions} questions in {formatTime(resultsData.timeSpent)}
            </p>
          </div>

          {/* Result Card */}
          <ResultCard
            score={resultsData.correctAnswers}
            totalQuestions={resultsData.totalQuestions}
            percentage={resultsData.score}
            timeTaken={formatTime(resultsData.timeSpent)}
          />

          {/* Score Breakdown */}
          <div className="bg-muted rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="text-2xl font-bold text-green-600">{resultsData.correctAnswers}</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                <p className="text-2xl font-bold text-red-600">
                  {resultsData.totalQuestions - resultsData.correctAnswers}
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Questions Answered</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.keys(resultsData.userAnswers || {}).length}/{resultsData.totalQuestions}
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {resultsData.totalQuestions > 0 
                    ? Math.round((resultsData.correctAnswers / resultsData.totalQuestions) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Review Your Answers */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Answers</h3>
            <Accordion type="single" collapsible className="w-full">
              {questionReview.map((question) => (
                <AccordionItem key={question.id} value={`question-${question.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium">Question {question.id}</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          {question.text.length > 50 ? `${question.text.substring(0, 50)}...` : question.text}
                        </span>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        question.isCorrect 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {question.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2 pl-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-3 rounded-lg border ${
                          question.isCorrect 
                            ? "bg-green-50 border-green-200" 
                            : "bg-red-50 border-red-200"
                        }`}>
                          <p className="text-sm font-medium text-muted-foreground">Your Answer:</p>
                          <p className={question.isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                            {question.yourAnswer}
                          </p>
                        </div>
                        {!question.isCorrect && (
                          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                            <p className="text-sm font-medium text-muted-foreground">Correct Answer:</p>
                            <p className="text-green-700 font-medium">{question.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                      
                      {question.explanation && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-2">Explanation:</p>
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/ibibazo" className="flex-1">
              <Button className="w-full gap-2" data-testid="button-try-again">
                <ArrowLeft className="h-4 w-4" />
                Try Another Quiz
              </Button>
            </Link>
            <Link href="/konte" className="flex-1">
              <Button variant="outline" className="w-full gap-2" data-testid="button-view-progress">
                View Progress
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}