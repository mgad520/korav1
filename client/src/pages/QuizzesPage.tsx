import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight, Check, Languages, AlertCircle, Play, BookOpen, Lock, CheckCircle, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuestions, type QuestionSet, type UserPlan } from "./useQuestions";
import Navbar from "@/components/Navbar";

// Cache for transformed quizzes
let quizzesCache: any[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Skeleton Components
const QuizListSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header Skeleton */}
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      {/* Header Text Skeleton */}
      <div className="text-center mb-6 space-y-3">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse"></div>
      </div>

      {/* Guest Notice Skeleton */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-2xl mx-auto animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-muted rounded"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Mobile Quiz Cards Skeleton */}
      <div className="md:hidden space-y-3 px-2 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-muted/50 animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 bg-muted rounded w-2/3"></div>
                      <div className="h-5 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="flex flex-wrap gap-3">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-9 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Quiz Cards Skeleton */}
      <div className="hidden md:block space-y-4 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-muted/50 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="flex flex-wrap gap-4">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-28"></div>
                  </div>
                </div>
                <div className="h-10 bg-muted rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sign Up CTA Skeleton */}
      <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mx-auto mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-4"></div>
        <div className="flex gap-4 justify-center">
          <div className="h-10 bg-muted rounded w-32"></div>
          <div className="h-10 bg-muted rounded w-40"></div>
        </div>
      </div>
    </div>
  </div>
);

const ExamPrepSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header Skeleton */}
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Header Text Skeleton */}
      <div className="text-center mb-8 space-y-3">
        <div className="h-8 bg-muted rounded w-1/2 mx-auto animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse"></div>
      </div>

      {/* Quiz Details Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="bg-muted/50 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-muted rounded"></div>
                <div className="h-5 bg-muted rounded w-1/3"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Section Skeleton */}
      <Card className="mb-8 bg-muted/50 animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-muted rounded mt-1"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="h-3 bg-muted rounded w-4/6"></div>
                  <div className="h-3 bg-muted rounded w-3/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Button Skeleton */}
      <div className="text-center">
        <div className="h-12 bg-muted rounded w-48 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ExamInterfaceSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header Skeleton */}
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* Exam Info Skeleton */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
        </div>
        <div className="h-2 bg-muted rounded-full animate-pulse"></div>
      </div>

      {/* Question Grid Skeleton */}
      <div className="w-full mb-6">
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="w-12 h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="w-8 h-8 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Card Skeleton */}
      <Card className="mb-6 bg-muted/50 animate-pulse">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Skeleton */}
            <div className="md:w-80 flex-shrink-0 order-first md:order-last">
              <div className="h-48 md:h-64 bg-muted rounded-xl"></div>
              <div className="h-3 bg-muted rounded w-20 mx-auto mt-2"></div>
            </div>

            {/* Question Content Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              
              {/* Choices Skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-4 bg-muted rounded w-16"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// Transform API questions to match your app's format with plan-based logic
const transformQuestions = (questionSets: QuestionSet[] | null | undefined, userPlan: UserPlan | null) => {
  // Handle cases where questionSets is not an array
  if (!questionSets || !Array.isArray(questionSets)) {
    console.warn('questionSets is not an array:', questionSets);
    return [];
  }
  
  console.log('User plan in transform:', userPlan);
  
  return questionSets.map((set, index) => {
    const setNumber = set.setNumber || index + 1;
    
    // Determine access based on user plan
    let isPremium = false;
    let requiresLogin = false;
    
    if (!userPlan) {
      // No user plan (guest or not logged in) - only set 1 is available
      isPremium = setNumber > 1;
      requiresLogin = setNumber > 1;
    } else {
      const planName = userPlan.planName?.toLowerCase() || '';
      
      if (planName === "no active plan" || planName === "") {
        // User has no active plan - only set 1 is available
        isPremium = setNumber > 1;
        requiresLogin = setNumber > 1;
      } else if (planName === "basic") {
        // Basic plan - sets 1 and 2 are available
        isPremium = setNumber > 2;
        requiresLogin = setNumber > 2;
      } else if (planName === "classic" || planName === "unique") {
        // Classic or Unique plan - all sets are available
        isPremium = false;
        requiresLogin = false;
      } else {
        // Unknown plan - default to basic access
        isPremium = setNumber > 1;
        requiresLogin = setNumber > 1;
      }
    }
    
    console.log(`Set ${setNumber}: Premium=${isPremium}, RequiresLogin=${requiresLogin}, Plan=${userPlan?.planName}`);
    
    return {
      id: setNumber.toString(),
      title: `Isuzuma rya ${setNumber}`,
      description: `Isuzuma ${setNumber}`,
      questionsCount: set.questions?.length || 0,
      isPremium,
      requiresLogin,
      duration: Math.ceil((set.questions?.length || 0) * 0.2),
      difficulty: setNumber === 1 ? "Beginner" : setNumber === 2 ? "Intermediate" : "Advanced",
      category: "Driving Theory",
      completed: false,
      score: null,
      questions: (set.questions || []).map((q, qIndex) => ({
        id: qIndex + 1,
        text: q.title || `Isuzuma rya ${qIndex + 1}`,
        imageUrl: q.image || undefined,
        explanation: q.explanation || "", // Add explanation field if available
        choices: (q.choice || []).map((choiceText, choiceIndex) => ({
          id: String.fromCharCode(65 + choiceIndex), // A, B, C, D
          text: choiceText || `Choice ${String.fromCharCode(65 + choiceIndex)}`,
          isCorrect: choiceIndex === (q.choiceAnswer || 0) // FIX: Use 0 as default if choiceAnswer is undefined
        }))
      }))
    };
  });
};

// Function to transform API questions from homepage to quiz format
const transformApiQuestionsToQuizFormat = (apiQuestions: any[]) => {
  return apiQuestions.map((q, index) => ({
    id: index + 1,
    text: q.title || `Question ${index + 1}`,
    imageUrl: q.image || undefined,
    explanation: "", // API doesn't provide explanations
    choices: (q.choice || []).map((choiceText: string, choiceIndex: number) => ({
      id: String.fromCharCode(65 + choiceIndex), // A, B, C, D
      text: choiceText || `Choice ${String.fromCharCode(65 + choiceIndex)}`,
      isCorrect: choiceIndex === (q.choiceAnswer || 0)
    }))
  }));
};

export const lessonQuizzes = [];

export default function ExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: { answer: string, isCorrect: boolean } }>({});
  const [location, setLocation] = useLocation();
  const [examStarted, setExamStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"quiz-list" | "exam-prep" | "exam">("quiz-list");
  const [isGuest, setIsGuest] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [showImmediateFeedback, setShowImmediateFeedback] = useState(true); // Default to showing feedback
  
  // NEW STATE: Track if we're loading from homepage exam
  const [loadingHomepageExam, setLoadingHomepageExam] = useState(false);
  const [homepageExamData, setHomepageExamData] = useState<any>(null);
  const [homepageExamQuestions, setHomepageExamQuestions] = useState<any[]>([]);

 // Update this useEffect in ExamPage
useEffect(() => {
  const userData = localStorage.getItem("user");
  setIsGuest(!userData);
  
  // Check if coming from homepage with exam intent
  const searchParams = new URLSearchParams(window.location.search);
  const examFromHomepage = searchParams.get("exam");
  const examSource = searchParams.get("source");
  
  // Handle both old and new parameters
  if (examFromHomepage === "full-exam" || (examFromHomepage === "direct" && examSource === "homepage")) {
    console.log("Coming from homepage with direct exam intent");
    setLoadingHomepageExam(true);
    
    // Try to get exam data from localStorage
    const savedQuestions = localStorage.getItem('exam-questions');
    
    if (savedQuestions) {
      try {
        const questionsData = JSON.parse(savedQuestions);
        
        // Extract questions from the API response
        if (questionsData.randomSet && questionsData.randomSet.questions) {
          const examQuestions = transformApiQuestionsToQuizFormat(questionsData.randomSet.questions);
          setHomepageExamQuestions(examQuestions);
          
          console.log("Loaded homepage exam questions:", examQuestions.length);
          
          // Create a unique quiz for homepage exam
          const homepageQuiz = {
            id: "homepage-exam",
            title: questionsData.randomSet.title || "Ikizamini cy'isuzuma",
            description: "Isuzuma ry'ibiganiro by'imodoka",
            questionsCount: examQuestions.length,
            isPremium: true,
            requiresLogin: true,
            duration: Math.ceil(examQuestions.length * 0.2),
            difficulty: "Medium",
            category: "Driving Theory",
            completed: false,
            score: null,
            questions: examQuestions,
            isHomepageExam: true // Flag to identify homepage exam
          };
          
          setHomepageExamData(homepageQuiz);
          
          // Set the quiz and go directly to exam prep
          setSelectedQuiz("homepage-exam");
          setCurrentView("exam-prep");
          setLoadingHomepageExam(false);
          
          // Clear the URL parameters
          const url = new URL(window.location.href);
          url.searchParams.delete("exam");
          url.searchParams.delete("source");
          url.searchParams.delete("type");
          window.history.replaceState({}, '', url.toString());
        }
      } catch (error) {
        console.error("Error parsing exam data:", error);
        setLoadingHomepageExam(false);
      }
    } else {
      setLoadingHomepageExam(false);
    }
  }
}, []);

  // Use the custom hook - now including userPlan
  const { questions: questionSets, userPlan, loading, error, refetch } = useQuestions();

  // State for transformed quizzes with caching
  const [transformedQuizzes, setTransformedQuizzes] = useState<any[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);

  // Check cache first, then transform if needed
  useEffect(() => {
    const now = Date.now();
    
    // Check if we have cached data
    if (quizzesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Using cached quizzes');
      setTransformedQuizzes(quizzesCache);
      return;
    }

    // Only transform if we have data and it's not already loading
    if (questionSets && !loading && !isTransforming) {
      setIsTransforming(true);
      
      // Use setTimeout to prevent blocking the UI
      setTimeout(() => {
        const transformed = transformQuestions(questionSets, userPlan);
        setTransformedQuizzes(transformed);
        
        // Update cache
        quizzesCache = transformed;
        cacheTimestamp = Date.now();
        
        setIsTransforming(false);
      }, 0);
    }
  }, [questionSets, userPlan, loading]);

  // NEW EFFECT: Handle homepage exam after data is loaded
  useEffect(() => {
    if (loadingHomepageExam && homepageExamData && homepageExamQuestions.length > 0) {
      console.log("Processing homepage exam...");
      
      // Set the quiz and go to exam prep
      setSelectedQuiz("homepage-exam");
      setCurrentView("exam-prep");
      setLoadingHomepageExam(false);
      
      // Clear the URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("exam");
      url.searchParams.delete("type");
      window.history.replaceState({}, '', url.toString());
    }
  }, [loadingHomepageExam, homepageExamData, homepageExamQuestions]);

  // Debug logs to track data flow
  useEffect(() => {
    console.log('=== DATA FLOW DEBUG ===');
    console.log('Question sets from hook:', questionSets);
    console.log('User plan:', userPlan);
    console.log('Number of sets:', questionSets?.length);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    console.log('Transformed quizzes:', transformedQuizzes.length);
    console.log('Is transforming:', isTransforming);
    console.log('Homepage exam data:', homepageExamData);
    console.log('Homepage exam questions:', homepageExamQuestions.length);
  }, [questionSets, userPlan, loading, error, transformedQuizzes, isTransforming, homepageExamData, homepageExamQuestions]);

  // Filter quizzes based on user status and plan
  const getAvailableQuizzes = () => {
    if (isGuest) {
      // Guest users only see non-premium, no-login-required sets
      const guestQuizzes = transformedQuizzes.filter(quiz => !quiz.isPremium && !quiz.requiresLogin);
      console.log('Guest available quizzes:', guestQuizzes.length);
      return guestQuizzes;
    } else {
      // Logged-in users see all sets based on their plan
      console.log('Logged-in user available quizzes:', transformedQuizzes.length);
      return transformedQuizzes;
    }
  };

  const availableQuizzes = getAvailableQuizzes();

  // Get current quiz data (handles both regular and homepage exams)
  const currentQuiz = selectedQuiz ? 
    (selectedQuiz === "homepage-exam" ? homepageExamData : transformedQuizzes.find(quiz => quiz.id === selectedQuiz)) 
    : null;

  // Check if current quiz is Set 1 to enable immediate feedback
  useEffect(() => {
    if (currentQuiz && (currentQuiz.id === "1")) {
      setShowImmediateFeedback(true);
    } else {
      setShowImmediateFeedback(false);
    }
  }, [currentQuiz]);

  // Initialize exam data from selected quiz
  const examData = currentQuiz ? {
    title: currentQuiz.title,
    totalQuestions: currentQuiz.questionsCount,
    currentQuestion: currentQuestion + 1,
    timeRemaining: timeRemaining,
    duration: currentQuiz.duration,
    questions: currentQuiz.questions,
    isSet1: currentQuiz.id === "1",
    isHomepageExam: currentQuiz.id === "homepage-exam" // Add flag
  } : null;

  // Initialize timer once
  useEffect(() => {
    if (currentView === "exam" && currentQuiz && examStarted && timeRemaining === 0) {
      const initialTime = currentQuiz.duration * 60;
      setTimeRemaining(initialTime);
    }
  }, [currentView, currentQuiz, examStarted]);

  // Countdown logic
  useEffect(() => {
    if (currentView !== "exam" || !examStarted) return;

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

    return () => clearInterval(timer);
  }, [examStarted, currentView]);

  const currentQ = examData?.questions[currentQuestion];
  const progress = examData ? (examData.currentQuestion / examData.totalQuestions) * 100 : 0;

  // Get the correct answer for the current question - FIXED
  const getCorrectAnswer = () => {
    if (!currentQ) return null;
    const correctChoice = currentQ.choices.find(choice => choice.isCorrect === true);
    return correctChoice ? correctChoice.id : null;
  };

  const isAnswerCorrect = (choiceId: string) => {
    if (!currentQ) return false;
    const correctAnswer = getCorrectAnswer();
    console.log(`Checking answer: choiceId=${choiceId}, correctAnswer=${correctAnswer}, isCorrect=${choiceId === correctAnswer}`);
    return choiceId === correctAnswer;
  };

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
    if (!currentQ || (showImmediateFeedback && answers[currentQuestion])) {
      // Don't allow changing answer if immediate feedback is shown and answer is already selected
      return;
    }

    const correct = isAnswerCorrect(choiceId);
    console.log(`Answer selected: ${choiceId}, correct=${correct}`);
    setSelectedAnswer(choiceId);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: { 
        answer: choiceId, 
        isCorrect: correct 
      }
    }));
  };

  const handleTimeUp = () => {
    if (!examData) return;
    
    // Calculate score before navigating
    const totalQuestions = examData.totalQuestions;
    const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    const resultsData = {
      questions: examData.questions,
      userAnswers: answers,
      totalQuestions: examData.totalQuestions,
      timeSpent: (examData.duration * 60) - timeRemaining,
      quizTitle: examData.title,
      score: score,
      correctAnswers: correctAnswers
    };
    
    console.log("Time's up! Navigating to results...", resultsData);
    setLocation(`/results?data=${encodeURIComponent(JSON.stringify(resultsData))}`);
  };

  const handleFinish = () => {
    if (!examData) return;
    
    // Calculate score before navigating
    const totalQuestions = examData.totalQuestions;
    const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    const resultsData = {
      questions: examData.questions,
      userAnswers: answers,
      totalQuestions: examData.totalQuestions,
      timeSpent: (examData.duration * 60) - timeRemaining,
      quizTitle: examData.title,
      score: score,
      correctAnswers: correctAnswers
    };
    
    console.log("Finishing exam...", resultsData);
    setLocation(`/results?data=${encodeURIComponent(JSON.stringify(resultsData))}`);
  };

  const handleNext = () => {
    if (!examData) return;
    
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextAnswer = answers[currentQuestion + 1];
      setSelectedAnswer(nextAnswer?.answer || null);
      
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
      const prevAnswer = answers[currentQuestion - 1];
      setSelectedAnswer(prevAnswer?.answer || null);
      
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
      const answer = answers[targetIndex];
      setSelectedAnswer(answer?.answer || null);
      
      const newPage = Math.floor(targetIndex / questionsPerPage);
      setMobilePage(newPage);
    }
  };

  const handleStartExam = () => {
    if (agreedToTerms && currentQuiz) {
      console.log("Starting exam for quiz:", currentQuiz.title);
      setExamStarted(true);
      setCurrentView("exam");
      // Reset answers when starting exam
      setAnswers({});
      setSelectedAnswer(null);
    }
  };

  const handleQuizSelect = (quizId: string) => {
    if (quizId === "homepage-exam" && homepageExamData) {
      // Handle homepage exam selection
      setSelectedQuiz(quizId);
      setCurrentView("exam-prep");
      setExamStarted(false);
      return;
    }

    // Original logic for regular quizzes
    const quiz = transformedQuizzes.find(q => q.id === quizId);
    if (!quiz) return;

    // Requires login
    if (quiz.requiresLogin && isGuest) {
      setLocation("/login");
      return;
    }

    // Premium protection
    if (quiz.isPremium) {
      if (isGuest) {
        setUpgradeMessage(
          "Injira Cyangwa wiyandikishe utangire gukora nonaha"
        );
        setShowUpgradeModal(true);
        return;
      } 
      else if (userPlan?.planName === "No Active Plan" || !userPlan) {
        setUpgradeMessage(
          "Gura ifatabuguzi rikunogeye ubone gufungura"
        );
        setShowUpgradeModal(true);
        return;
      }
    }

    setSelectedQuiz(quizId);
    setCurrentView("exam-prep");
    setExamStarted(false);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setCurrentView("quiz-list");
    setExamStarted(false);
    setTimeRemaining(0);
    setAnswers({});
    setSelectedAnswer(null);
    
    // Clear homepage exam data if it exists
    if (homepageExamData) {
      localStorage.removeItem('exam-questions');
    }
  };

  const handleLoginRedirect = () => {
    setLocation("/login");
  };

  const handleSignupRedirect = () => {
    setLocation("/login");
  };

  // Question number grid component with immediate feedback indicators
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
          {questionsToShow.map((questionNumber) => {
            const answer = answers[questionNumber - 1];
            const isCurrent = questionNumber === examData.currentQuestion;
            
            return (
              <button
                key={questionNumber}
                className={`w-8 h-8 md:w-12 md:h-12 rounded border text-xs md:text-sm font-medium transition-all flex-shrink-0 flex items-center justify-center relative ${
                  isCurrent
                    ? "bg-green-200 text-black border-2 border-green-500"
                    : answer
                    ? answer.isCorrect
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-red-500 text-white border-red-600"
                    : "bg-muted border-border hover:bg-muted/80"
                }`}
                onClick={() => handleQuestionSelect(questionNumber)}
              >
                {questionNumber}
                {answer && (
                  <span className=""></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Get user plan display name
  const getUserPlanDisplay = () => {
    if (isGuest) return "Guest";
    if (!userPlan) return "Free";
    return userPlan.planName === "No Active Plan" ? "Free" : userPlan.planName;
  };

  // Get user status color
  const getUserStatusColor = () => {
    if (isGuest) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (!userPlan || userPlan.planName === "No Active Plan") return "bg-blue-100 text-blue-800 border-blue-200";
    if (userPlan.planName === "Basic") return "bg-green-100 text-green-800 border-green-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  // Combined loading state - show skeleton only for initial load
  const showInitialLoading = loading && currentView === "quiz-list" && transformedQuizzes.length === 0;
  const showDataLoading = (loading || isTransforming) && transformedQuizzes.length === 0 && currentView === "quiz-list";

  if (showInitialLoading || showDataLoading) {
    return <QuizListSkeleton />;
  }

  // Error state
  if (error && currentView === "quiz-list") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Gukurura ntibyakunze</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch}>Ongera Ugerageze</Button>
        </div>
      </div>
    );
  }

  // Show content based on current view
  return (
    <>
      {/* Show loading indicator while processing homepage exam */}
      {loadingHomepageExam && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center bg-background p-8 rounded-2xl shadow-xl max-w-md mx-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Kura ikizamini</h3>
            <p className="text-muted-foreground">Twiteguye ikizamini cy'isuzuma...</p>
          </div>
        </div>
      )}

      {/* Quiz List View */}
      {currentView === "quiz-list" && !loadingHomepageExam && (
        <div className="min-h-screen bg-background">
          <div className="w-full">
            <Navbar />
          </div>
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">Ibizamini</h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                {isGuest 
                  ? "Dutangira n'ikizamini cyacu cy'ubuntu. Iyandikishe kugira ngo ufungure ibisubizo byose byisumbuye (premium)." 
                  : "Gerageza ubumenyi bwawe ukoresheje ibibazo nyakuri byo mu mategeko y'umuhanda."}
              </p>

              {/* Guest Notice */}
              {isGuest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-blue-800 font-medium text-sm">
                        Limited Access - Guest Mode
                      </p>
                      <p className="text-blue-700 text-xs">
                        Sign up to unlock {transformedQuizzes.length - availableQuizzes.length} additional quiz sets and premium features
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Show loading indicator while transforming */}
            {(loading || isTransforming) && transformedQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading quiz sets...</p>
              </div>
            ) : availableQuizzes.length === 0 && !homepageExamData ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nta bizamini biboneka</h3>
                <p className="text-muted-foreground mb-4">Garuka hanyuma urebe niba hari ibindi bibazo bishya byongewe.</p>
                {isGuest && (
                  <Button onClick={handleSignupRedirect}>
                   Iyandikishe kugira ngo ubone uburyo bwo gukora ibizamini.
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Show homepage exam card if available */}
                {homepageExamData && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-center text-purple-700">Ikizamini cy'isuzuma</h3>
                    
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3 px-2">
                      
                      <Card 
                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-transparent"
                        onClick={() => handleQuizSelect("homepage-exam")}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-semibold leading-tight">{homepageExamData.title}</h3>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Flag className="h-3 w-3" />
                                    Special Exam
                                  </span>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {homepageExamData.difficulty}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {homepageExamData.description}
                            </p>

                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>Ibibazo {homepageExamData.questionsCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Iminota {homepageExamData.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{homepageExamData.category}</span>
                              </div>
                            </div>

                            {/* Feature indicator */}
                            <div className="flex items-center gap-2 text-xs bg-blue-50 px-3 py-2 rounded-lg">
                              <CheckCircle className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-700 font-medium">Practice with immediate feedback</span>
                            </div>

                            {/* Start Button */}
                            <Button 
                              className="w-full gap-2 h-9 text-sm bg-purple-600 hover:bg-purple-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuizSelect("homepage-exam");
                              }}
                            >
                              <Play className="h-3 w-3" />
                              Tangira Ikizamini
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <Card 
                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-transparent mb-6"
                        onClick={() => handleQuizSelect("homepage-exam")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold">{homepageExamData.title}</h3>
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                  <Flag className="h-4 w-4" />
                                  Special Exam
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {homepageExamData.difficulty}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-4">{homepageExamData.description}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{homepageExamData.questionsCount} questions</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{homepageExamData.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>Category: {homepageExamData.category}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Immediate feedback</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              className="ml-4 bg-purple-600 hover:bg-purple-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuizSelect("homepage-exam");
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Exam
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Mobile Layout for regular quizzes */}
                <div className="md:hidden space-y-3 px-2">
                  {availableQuizzes.map((quiz) => (
                    <Card 
                      key={quiz.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                        quiz.isPremium 
                          ? "border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent" 
                          : "border-l-green-500"
                      } ${quiz.requiresLogin && isGuest ? "opacity-75" : ""}`}
                      onClick={() => handleQuizSelect(quiz.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header with title and difficulty */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-semibold leading-tight">{quiz.title}</h3>
                                {quiz.isPremium && (
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    Premium
                                  </span>
                                )}
                              </div>
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
                              <span>Ibibazo {quiz.questionsCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Iminota {quiz.duration} </span>
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

                          {/* Feature indicator for Set 1 */}
                          {quiz.id === "1" && (
                            <div className="flex items-center gap-2 text-xs bg-blue-50 px-3 py-2 rounded-lg">
                              <CheckCircle className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-700 font-medium">Immediate feedback on answers</span>
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
                              handleQuizSelect(quiz.id);
                            }}
                          >
                            {quiz.isPremium ? (
                              <>
                                <Lock className="h-3 w-3" />
                                {isGuest ? "Sign Up to Access" : "Unlock Premium"}
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" />
                                {quiz.completed ? "Subiramo Isuzuma" : "Tangira Isuzuma"}
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Locked Quizzes for Guests */}
                  {isGuest && transformedQuizzes.length > availableQuizzes.length && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 text-center text-muted-foreground">
                        Premium Quizzes Available
                      </h3>
                      <div className="space-y-3">
                        {transformedQuizzes
                          .filter(quiz => quiz.requiresLogin || quiz.isPremium)
                          .map((quiz) => (
                          <Card key={quiz.id} className="bg-gray-50 border-l-4 border-l-gray-400 opacity-75">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-base font-semibold leading-tight text-gray-600">{quiz.title}</h3>
                                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Lock className="h-3 w-3" />
                                        Premium
                                      </span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      quiz.difficulty === "Beginner" ? "bg-gray-200 text-gray-700" :
                                      quiz.difficulty === "Intermediate" ? "bg-gray-200 text-gray-700" :
                                      "bg-gray-200 text-gray-700"
                                    }`}>
                                      {quiz.difficulty}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed">
                                  {quiz.description}
                                </p>

                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span>{quiz.questionsCount} questions</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{quiz.duration} min</span>
                                  </div>
                                </div>

                                <Button 
                                  variant="outline"
                                  className="w-full gap-2 h-9 text-sm bg-white text-gray-600 border-gray-300"
                                  onClick={handleSignupRedirect}
                                >
                                  <Lock className="h-3 w-3" />
                                  Sign Up to Unlock
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Layout for regular quizzes */}
                <div className="hidden md:block space-y-4">
                  {availableQuizzes.map((quiz) => (
                    <Card 
                      key={quiz.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                        quiz.isPremium 
                          ? "border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent" 
                          : "border-l-green-500"
                      } ${quiz.requiresLogin && isGuest ? "opacity-75" : ""}`}
                      onClick={() => handleQuizSelect(quiz.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{quiz.title}</h3>
                              {quiz.isPremium && (
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  Premium
                                </span>
                              )}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                              {/* Feature indicator for Set 1 */}
                              {quiz.id === "1" && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Immediate feedback</span>
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
                              handleQuizSelect(quiz.id);
                            }}
                          >
                            {quiz.isPremium ? (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                {isGuest ? "Sign Up" : "Unlock"}
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

                  {/* Locked Quizzes Section for Guests */}
                  {isGuest && transformedQuizzes.length > availableQuizzes.length && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-6 text-center text-muted-foreground border-b pb-2">
                        Premium Quizzes - Sign Up to Unlock
                      </h3>
                      <div className="grid gap-4">
                        {transformedQuizzes
                          .filter(quiz => quiz.requiresLogin || quiz.isPremium)
                          .map((quiz) => (
                          <Card key={quiz.id} className="bg-gray-50 border-l-4 border-l-gray-400 opacity-75">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-600">{quiz.title}</h3>
                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                      <Lock className="h-4 w-4" />
                                      Premium
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700`}>
                                      {quiz.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-gray-500 mb-4">{quiz.description}</p>
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="h-4 w-4" />
                                      <span>{quiz.questionsCount} questions</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{quiz.duration} minutes</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <Button 
                                  variant="outline"
                                  className="ml-4 bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                  onClick={handleSignupRedirect}
                                >
                                  <Lock className="h-4 w-4 mr-2" />
                                  Sign Up to Unlock
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sign Up CTA for Guests */}
                {isGuest && (
                  <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border">
                    <h3 className="text-xl font-semibold mb-2">Ready for More?</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up now to unlock all {transformedQuizzes.length} quiz sets and track your progress!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={handleSignupRedirect} className="bg-green-600 hover:bg-green-700">
                        Create Free Account
                      </Button>
                      <Button variant="outline" onClick={handleLoginRedirect}>
                        Already have an account?
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Exam Preparation View */}
      {currentView === "exam-prep" && currentQuiz && (
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
                {currentQuiz.id === "homepage-exam" && (
                  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <Flag className="h-3 w-3" />
                    Special Exam from Homepage
                  </div>
                )}
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
                      {/* Feature indicator for homepage exam */}
                      {(currentQuiz.id === "1" || currentQuiz.id === "homepage-exam") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mode:</span>
                          <span className="font-medium text-blue-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Practice with immediate feedback
                          </span>
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
                            {(currentQuiz.id === "1" || currentQuiz.id === "homepage-exam") && (
                              <li className="text-blue-600">• You will see immediate feedback after each answer</li>
                            )}
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
                  {(currentQuiz.id === "1" || currentQuiz.id === "homepage-exam") && (
                    <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <CheckCircle className="h-3 w-3" />
                      Practice mode with immediate feedback
                    </div>
                  )}
                  {currentQuiz.id === "homepage-exam" && (
                    <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      <Flag className="h-3 w-3" />
                      Special Exam
                    </div>
                  )}
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
      )}

      {/* Exam Interface View */}
      {currentView === "exam" && examData && currentQ && (
        <div className="min-h-screen bg-background">

          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
            {/* Exam Info */}
            <div className="mb-6">
              {/* Top Row: Title and Timer */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">{examData.title}</h1>
                <div className="flex items-center gap-2 text-orange-600 text-lg md:text-xl font-semibold">
                  <Clock className="h-5 w-5" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Question Info */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                <span>Question {examData.currentQuestion} of {examData.totalQuestions}</span>
              </div>

              {/* Progress Bar */}
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
                            className="w-full h-48 md:h-64 object-contain"
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
                        {currentQ.choices.map((choice) => {
                          const currentAnswer = answers[currentQuestion];
                          const isSelected = selectedAnswer === choice.id;
                          const showCorrect = showImmediateFeedback && currentAnswer;
                          const isCorrectChoice = choice.isCorrect === true; // FIX: Explicit check for true
                          const isWrongSelected = showCorrect && isSelected && !isCorrectChoice;
                          const isCorrectSelected = showCorrect && isSelected && isCorrectChoice;
                          
                          return (
                            <button
                              key={choice.id}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all group ${
                                isSelected
                                  ? showImmediateFeedback
                                    ? isCorrectSelected
                                      ? "border-green-500 bg-green-50 shadow-sm"
                                      : isWrongSelected
                                      ? "border-red-500 bg-red-50 shadow-sm"
                                      : "border-primary bg-primary/5 shadow-sm"
                                    : "border-primary bg-primary/5 shadow-sm"
                                  : showCorrect && isCorrectChoice
                                  ? "border-green-500 bg-green-50 shadow-sm"
                                  : "border-border bg-background hover:bg-muted/50 hover:border-muted-foreground/20"
                              }`}
                              onClick={() => handleAnswerSelect(choice.id)}
                              disabled={showImmediateFeedback && currentAnswer !== undefined}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                                  isSelected
                                    ? showImmediateFeedback
                                      ? isCorrectSelected
                                        ? "border-green-500 bg-green-500 text-white"
                                        : isWrongSelected
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "border-primary bg-primary text-primary-foreground"
                                      : "border-primary bg-primary text-primary-foreground"
                                    : showCorrect && isCorrectChoice
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-border group-hover:border-primary/50"
                                }`}>
                                  {choice.id}
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm md:text-base leading-relaxed">{choice.text}</span>
                                  {showCorrect && isCorrectChoice && !isSelected && (
                                    <div className="mt-0 flex items-center gap-1 text-green-600 text-xs"></div>
                                  )}
                                </div>
                                {showImmediateFeedback && currentAnswer && (
                                  <div className="flex-shrink-0">
                                    {isCorrectSelected && (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    {isWrongSelected && (
                                      <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Bottom Navigation - Fixed but only when needed */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
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
                  disabled={showImmediateFeedback && (examData.isSet1 || examData.isHomepageExam) && !answers[currentQuestion]}
                  className={`flex-1 max-w-[120px] ${
                    showImmediateFeedback && (examData.isSet1 || examData.isHomepageExam) && !answers[currentQuestion]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {currentQuestion === examData.questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback in case no view matches */}
      {!["quiz-list", "exam-prep", "exam"].includes(currentView) && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <Button onClick={handleBackToQuizzes}>Back to Quizzes</Button>
          </div>
        </div>
      )}

      {/* ✅ UPGRADE MODAL - NOW AT ROOT LEVEL ✅ */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Background */}
          <div
            onClick={() => setShowUpgradeModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Nta fatabuguzi Ufite
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6">
              {upgradeMessage}
            </p>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 rounded-xl"
              >
                Gufunga
              </Button>

              <Button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setLocation("/subscribe");
                }}
                className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md"
              >
                Gura Classic
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}