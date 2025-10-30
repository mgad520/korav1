import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight, Check, Languages, AlertCircle, Play, BookOpen } from "lucide-react";
import { Link, useLocation } from "wouter"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for lesson quizzes with exam questions
// Mock data for lesson quizzes with exam questions
export const lessonQuizzes = [
  {
    id: "1",
    title: "Traffic Signs & Signals Quiz",
    description: "Test your knowledge of road signs, signals, and markings",
    questionsCount: 6,
    isPremium:false,
    duration: 30, // 30 minutes
    difficulty: "Beginner",
    category: "Road Signs",
    completed: false,
    score: null,
    questions: [
      {
        id: 1,
        text: "What does a red traffic light indicate?",
        choices: [
          { id: "A", text: "Slow down and proceed with caution", isCorrect: false },
          { id: "B", text: "Stop and wait until it turns green", isCorrect: true },
          { id: "C", text: "Speed up to cross the intersection", isCorrect: false },
          { id: "D", text: "Proceed if no other vehicles are present", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "What does this traffic sign mean?",
        imageUrl: "https://images.unsplash.com/photo-1549313861-33587-3c1b-5f50a6a11c45?w=400&h=200&fit=crop",
        choices: [
          { id: "A", text: "No parking allowed", isCorrect: false },
          { id: "B", text: "Stop sign ahead", isCorrect: true },
          { id: "C", text: "Yield to oncoming traffic", isCorrect: false },
          { id: "D", text: "Speed limit zone", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "What does a blue circular sign indicate?",
        choices: [
          { id: "A", text: "Warning of danger ahead", isCorrect: false },
          { id: "B", text: "Mandatory instruction", isCorrect: true },
          { id: "C", text: "Prohibition", isCorrect: false },
          { id: "D", text: "Information", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Identify this road marking:",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop",
        choices: [
          { id: "A", text: "Pedestrian crossing", isCorrect: true },
          { id: "B", text: "No overtaking zone", isCorrect: false },
          { id: "C", text: "Speed bump ahead", isCorrect: false },
          { id: "D", text: "Bus lane marking", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "What does a flashing yellow light mean?",
        choices: [
          { id: "A", text: "Stop immediately", isCorrect: false },
          { id: "B", text: "Proceed with caution", isCorrect: true },
          { id: "C", text: "Speed limit zone", isCorrect: false },
          { id: "D", text: "No parking allowed", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "What action should you take when you see this sign?",
        imageUrl: "https://images.myparkingsign.com/img/lg2/K/k2-4958-2.png",
        choices: [
          { id: "A", text: "Speed up to merge quickly", isCorrect: false },
          { id: "B", text: "Stop and wait for gap", isCorrect: false },
          { id: "C", text: "Yield to traffic on main road", isCorrect: true },
          { id: "D", text: "Honk horn and proceed", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Road Safety Rules Quiz",
    description: "Assess your understanding of defensive driving and safety procedures",
    questionsCount: 6,
    isPremium:true,
    duration: 35, // 35 minutes
    difficulty: "Intermediate",
    category: "Safety Rules",
    completed: true,
    score: 85,
    questions: [
      {
        id: 1,
        text: "When approaching a roundabout, you should:",
        choices: [
          { id: "A", text: "Speed up to get through quickly", isCorrect: false },
          { id: "B", text: "Slow down and give way to traffic from your right", isCorrect: true },
          { id: "C", text: "Honk your horn to alert other drivers", isCorrect: false },
          { id: "D", text: "Drive in the center of the road", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "What is the safe following distance shown in this situation?",
        imageUrl: "https://images.unsplash.com/photo-1563720223485-194d4845e1a9?w=400&h=200&fit=crop",
        choices: [
          { id: "A", text: "1 second gap", isCorrect: false },
          { id: "B", text: "2 second gap", isCorrect: true },
          { id: "C", text: "3 car lengths", isCorrect: false },
          { id: "D", text: "5 meters", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "When should you use your hazard lights?",
        choices: [
          { id: "A", text: "When driving in heavy rain", isCorrect: false },
          { id: "B", text: "When your vehicle is stopped and obstructing traffic", isCorrect: true },
          { id: "C", text: "When you're running late", isCorrect: false },
          { id: "D", text: "When driving through a tunnel", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "What does this emergency vehicle signal mean?",
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=200&fit=crop",
        choices: [
          { id: "A", text: "Road construction ahead", isCorrect: false },
          { id: "B", text: "Emergency vehicle approaching", isCorrect: true },
          { id: "C", text: "Police checkpoint", isCorrect: false },
          { id: "D", text: "Ambulance parking only", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "What should you do when being overtaken?",
        choices: [
          { id: "A", text: "Speed up to prevent being overtaken", isCorrect: false },
          { id: "B", text: "Move to the left and maintain speed", isCorrect: true },
          { id: "C", text: "Flash your headlights", isCorrect: false },
          { id: "D", text: "Brake suddenly", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "Identify the correct hand signal for a right turn:",
        imageUrl: "https://images.myparkingsign.com/img/lg2/K/k2-4958-2.png",
        choices: [
          { id: "A", text: "Left arm extended straight out", isCorrect: false },
          { id: "B", text: "Left arm bent upward at elbow", isCorrect: true },
          { id: "C", text: "Left arm bent downward at elbow", isCorrect: false },
          { id: "D", text: "Right arm extended straight out", isCorrect: false },
        ],
      },
    ],
  },
];

export default function ExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [location, setLocation] = useLocation();
  const [examStarted, setExamStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"quiz-list" | "exam-prep" | "exam">("quiz-list");

  // Get current quiz data
  const currentQuiz = selectedQuiz ? lessonQuizzes.find(quiz => quiz.id === selectedQuiz) : null;

  // Initialize exam data from selected quiz
  const examData = currentQuiz ? {
    title: currentQuiz.title,
    totalQuestions: currentQuiz.questionsCount,
    currentQuestion: currentQuestion + 1,
    timeRemaining: timeRemaining,
    duration: currentQuiz.duration,
    questions: currentQuiz.questions,
  } : null;

  // Timer effect - FIXED
  useEffect(() => {
    if (currentView !== "exam" || !examStarted || !examData) return;

    console.log("Timer started:", timeRemaining, "seconds remaining");

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log("Timer cleaned up");
      clearInterval(timer);
    };
  }, [examStarted, currentView, examData]);

  // Initialize timer when exam starts - FIXED
  useEffect(() => {
    if (currentView === "exam" && currentQuiz && examStarted) {
      const initialTime = currentQuiz.duration * 60; // Convert minutes to seconds
      console.log("Initializing timer:", initialTime, "seconds");
      setTimeRemaining(initialTime);
    }
  }, [currentView, currentQuiz, examStarted]);

  const currentQ = examData?.questions[currentQuestion];
  const progress = examData ? (examData.currentQuestion / examData.totalQuestions) * 100 : 0;

  // Mobile pagination
  const questionsPerPage = 10;
  const totalMobilePages = examData ? Math.ceil(examData.totalQuestions / questionsPerPage) : 0;
  const startQuestion = mobilePage * questionsPerPage;
  const endQuestion = examData ? Math.min(startQuestion + questionsPerPage, examData.totalQuestions) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (choiceId: string) => {
    setSelectedAnswer(choiceId);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: choiceId
    }));
  };

  const handleTimeUp = () => {
    if (!examData) return;
    
    const resultsData = {
      questions: examData.questions,
      userAnswers: answers,
      totalQuestions: examData.totalQuestions,
      timeSpent: (examData.duration * 60) - timeRemaining,
      quizTitle: examData.title
    };
    console.log("Time's up! Navigating to results...");
    setLocation(`/results?data=${encodeURIComponent(JSON.stringify(resultsData))}`);
  };

  const handleFinish = () => {
    if (!examData) return;
    
    const resultsData = {
      questions: examData.questions,
      userAnswers: answers,
      totalQuestions: examData.totalQuestions,
      timeSpent: (examData.duration * 60) - timeRemaining,
      quizTitle: examData.title
    };
    setLocation(`/results?data=${encodeURIComponent(JSON.stringify(resultsData))}`);
  };

  const handleNext = () => {
    if (!examData) return;
    
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
      
      const newQuestionIndex = currentQuestion + 1;
      const newPage = Math.floor(newQuestionIndex / questionsPerPage);
      if (newPage !== mobilePage) {
        setMobilePage(newPage);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      
      const newQuestionIndex = currentQuestion - 1;
      const newPage = Math.floor(newQuestionIndex / questionsPerPage);
      if (newPage !== mobilePage) {
        setMobilePage(newPage);
      }
    }
  };

  const handleQuestionSelect = (questionNumber: number) => {
    const targetIndex = questionNumber - 1;
    if (examData && targetIndex >= 0 && targetIndex < examData.questions.length) {
      setCurrentQuestion(targetIndex);
      setSelectedAnswer(answers[targetIndex] || null);
      
      const newPage = Math.floor(targetIndex / questionsPerPage);
      setMobilePage(newPage);
    }
  };

  const handleStartExam = () => {
    if (agreedToTerms && currentQuiz) {
      console.log("Starting exam for quiz:", currentQuiz.title);
      setExamStarted(true);
      setCurrentView("exam");
      // Timer will be initialized by the useEffect above
    }
  };

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuiz(quizId);
    setCurrentView("exam-prep");
    setExamStarted(false); // Reset exam state when selecting new quiz
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setCurrentView("quiz-list");
    setExamStarted(false);
    setTimeRemaining(0);
  };

  // Question number grid component
  const QuestionGrid = ({ showAll = false }) => {
    if (!examData) return null;
    
    const questionsToShow = showAll 
      ? Array.from({ length: examData.totalQuestions }, (_, i) => i + 1)
      : Array.from({ length: endQuestion - startQuestion }, (_, i) => startQuestion + i + 1);

    return (
      <div className="w-full">
        {/* Mobile Pagination Controls */}
        {!showAll && totalMobilePages > 1 && (
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobilePage(prev => Math.max(0, prev - 1))}
              disabled={mobilePage === 0}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground font-medium">
              Questions {startQuestion + 1}-{endQuestion} of {examData.totalQuestions}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobilePage(prev => Math.min(totalMobilePages - 1, prev + 1))}
              disabled={mobilePage === totalMobilePages - 1}
              className="h-8 px-3"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className={`flex flex-wrap gap-1 md:gap-2 ${showAll ? '' : ''}`}>
          {questionsToShow.map((questionNumber) => (
            <button
              key={questionNumber}
              className={`w-8 h-8 md:w-12 md:h-12 rounded border text-xs md:text-sm font-medium transition-all flex-shrink-0 ${
                questionNumber === examData.currentQuestion
                  ? "bg-green-200 text-primary-foreground border-2 border-green-500"
                  : answers[questionNumber - 1]
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-muted border-border hover:bg-muted/80"
              }`}
              onClick={() => handleQuestionSelect(questionNumber)}
            >
              {questionNumber}
            </button>
          ))}
        </div>
      </div>
    );
  };

// Quiz List View
if (currentView === "quiz-list") {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ahabanza">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
            
            <div className="text-sm text-muted-foreground">
              Practice Quizzes
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Practice Quizzes</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Test your knowledge with these practice quizzes.
          </p>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3 px-2">
          {lessonQuizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500"
              onClick={() => !quiz.isPremium && handleQuizSelect(quiz.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header with title and difficulty */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold leading-tight mb-1">{quiz.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                        quiz.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {quiz.description}
                  </p>

                  {/* Quiz Details */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{quiz.questionsCount} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{quiz.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{quiz.category}</span>
                    </div>
                  </div>

                  {/* Score if completed */}
                  {quiz.completed && (
                    <div className="flex items-center gap-2 text-xs bg-green-50 px-3 py-2 rounded-lg">
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-700 font-medium">Score: {quiz.score}%</span>
                    </div>
                  )}

                  {/* Start Button */}
                  <Button 
                    className={`w-full gap-2 h-9 text-sm ${
                      quiz.isPremium 
                        ? "bg-yellow-600 hover:bg-yellow-700" 
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!quiz.isPremium) {
                        handleQuizSelect(quiz.id);
                      }
                    }}
                  >
                    {quiz.isPremium ? (
                      <>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>
                        </svg>
                        Premium
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block space-y-4">
          {lessonQuizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500"
              onClick={() => !quiz.isPremium && handleQuizSelect(quiz.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{quiz.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                        quiz.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{quiz.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{quiz.questionsCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Category: {quiz.category}</span>
                      </div>
                      {quiz.completed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-4 w-4" />
                          <span>Score: {quiz.score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className={`ml-4 ${
                      quiz.isPremium 
                        ? "bg-yellow-600 hover:bg-yellow-700" 
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!quiz.isPremium) {
                        handleQuizSelect(quiz.id);
                      }
                    }}
                  >
                    {quiz.isPremium ? (
                      <>
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>
                        </svg>
                        Premium
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {quiz.completed ? "Retake" : "Start"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
 // Exam Preparation View
if (currentView === "exam-prep" && currentQuiz) {
  return (
    <>
      {/* Mobile Layout - Full Screen */}
      <div className="md:hidden min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={handleBackToQuizzes}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Quizzes</span>
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {currentQuiz.title}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentQuiz.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentQuiz.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Quiz Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  Quiz Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Questions:</span>
                    <span className="font-medium">{currentQuiz.questionsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Limit:</span>
                    <span className="font-medium">{currentQuiz.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium">{currentQuiz.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{currentQuiz.category}</span>
                  </div>
                  {currentQuiz.completed && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Previous Score:</span>
                      <span className="font-medium text-green-600">{currentQuiz.score}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Quiz Configuration</h3>
              
              <div className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-3">
                  <Label htmlFor="language" className="flex items-center gap-2 text-base">
                    <Languages className="h-4 w-4" />
                    Select Quiz Language
                  </Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The quiz questions and instructions will be displayed in {selectedLanguage}.
                  </p>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I agree to the terms and conditions of this quiz. I understand that:
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>• I must complete the quiz within the time limit</li>
                        <li>• I cannot pause or restart the quiz once started</li>
                        <li>• My answers will be automatically submitted when time expires</li>
                        <li>• This is a practice quiz for learning purposes</li>
                      </ul>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleStartExam}
              disabled={!agreedToTerms}
              className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
            >
              {currentQuiz.completed ? "Retake Quiz" : "Start Quiz"}
            </Button>
            {!agreedToTerms && (
              <p className="text-sm text-muted-foreground mt-3">
                Please agree to the terms and conditions to start the quiz
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Modal Overlay */}
      <div className="hidden md:flex fixed inset-0 bg-black/50 backdrop-blur-sm z-50 items-center justify-center p-8">
        <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-background border-b px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={handleBackToQuizzes}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quizzes
              </Button>
              <div className="text-sm text-muted-foreground">
                Quiz Preparation
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">{currentQuiz.title}</h1>
              <p className="text-muted-foreground">
                {currentQuiz.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Quiz Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    Quiz Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{currentQuiz.questionsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{currentQuiz.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-medium">{currentQuiz.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{currentQuiz.category}</span>
                    </div>
                    {currentQuiz.completed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Previous Score:</span>
                        <span className="font-medium text-green-600">{currentQuiz.score}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-green-500" />
                    Quick Setup
                  </h3>
                  <div className="space-y-3">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="desktop-terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                      <label
                        htmlFor="desktop-terms"
                        className="text-xs leading-relaxed cursor-pointer"
                      >
                        I agree to the terms
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleStartExam}
                disabled={!agreedToTerms}
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              >
                {currentQuiz.completed ? "Retake Quiz" : "Start Quiz Now"}
              </Button>
              {!agreedToTerms && (
                <p className="text-sm text-muted-foreground mt-2">
                  Please agree to the terms to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
  // Main Exam Interface
  if (currentView === "exam" && examData && currentQ) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Language: {selectedLanguage}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Flag className="h-4 w-4" />
                  <span className="hidden sm:inline">Flag</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          {/* Exam Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{examData.title}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-3">
              <span>Question {examData.currentQuestion} of {examData.totalQuestions}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)} remaining</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Numbers Grid - Full Width */}
          <div className="w-full mb-6">
            <div className="hidden md:block">
              <QuestionGrid showAll={true} />
            </div>
            <div className="md:hidden">
              <QuestionGrid showAll={false} />
            </div>
          </div>

{/* Question Card */}
<Card className="mb-6">
  <CardContent className="p-6">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Question Image - Top on Mobile, Right Side on Desktop */}
      {currentQ.imageUrl && (
        <div className="md:w-80 flex-shrink-0 order-first md:order-last">
          <div className="md:sticky md:top-6">
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <img 
                src={currentQ.imageUrl} 
                alt="Question visual reference"
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center italic">
              Visual reference
            </p>
          </div>
        </div>
      )}

      {/* Question Text and Choices - Bottom on Mobile, Left Side on Desktop */}
      <div className="flex-1">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-4 leading-relaxed">
              {currentQ.text}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQ.choices.map((choice) => (
              <button
                key={choice.id}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all group ${
                  selectedAnswer === choice.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background hover:bg-muted/50 hover:border-muted-foreground/20"
                }`}
                onClick={() => handleAnswerSelect(choice.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                    selectedAnswer === choice.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border group-hover:border-primary/50"
                  }`}>
                    {choice.id}
                  </div>
                  <span className="text-sm md:text-base leading-relaxed">{choice.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>


{/* Mobile Bottom Navigation - Fixed but only when needed */}
<div className=" fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
  <div className="flex justify-between items-center">
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrevious}
      disabled={currentQuestion === 0}
      className="flex-1 max-w-[120px]"
    >
      Previous
    </Button>
    
    <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>{formatTime(timeRemaining)}</span>
      </div>
      <span>Q{examData.currentQuestion}/{examData.totalQuestions}</span>
    </div>
    
    <Button
      size="sm"
      onClick={currentQuestion === examData.questions.length - 1 ? handleFinish : handleNext}
      disabled={!selectedAnswer}
      className="flex-1 max-w-[120px] bg-primary hover:bg-primary/90"
    >
      {currentQuestion === examData.questions.length - 1 ? "Finish" : "Next"}
    </Button>
  </div>
</div>
        </div>
      </div>
    );
  }

  // Fallback in case no view matches
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <Button onClick={handleBackToQuizzes}>Back to Quizzes</Button>
      </div>
    </div>
  );
}