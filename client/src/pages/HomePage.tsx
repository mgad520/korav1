import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Users, TrendingUp, ArrowRight, Play, ChevronRight, ChevronLeft, Calendar, Star, Target, Clock, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import {lessonQuizzes} from "./QuizzesPage";
import { useState,useEffect } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
const [currentView, setCurrentView] = useState<"quiz-list" | "exam-prep" | "exam">("quiz-list");
const [agreedToTerms, setAgreedToTerms] = useState(false);
const [examStarted, setExamStarted] = useState(false);
const [location, setLocation] = useLocation();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() - 1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [practiceProgress, setPracticeProgress] = useState(0);

  // Mock user progress data
  const [userProgress, setUserProgress] = useState({
    learningTime: 8 * 60 + 24, // 8h 24m in minutes
    lessonsCompleted: 12,
    totalLessons: 16,
    practiceTests: 85,
  });

  const featuredModules = [
    {
      id: "1",
      title: "Traffic Signs & Signals",
      description: "Master all essential road signs, signals, and markings for safe driving in Rwanda",
      level: "LEVEL 1",
      progress: "Basic Road Signs",
       imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
      lessonsCount: 45,
      progressValue: 75,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "2", 
      title: "Road Safety Rules",
      description: "Learn defensive driving techniques and emergency procedures",
      level: "LEVEL 2",
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
      progress: "Defensive Driving",
      lessonsCount: 32,
      progressValue: 40,
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "3",
      title: "Vehicle Control & Maneuvers",
      description: "Master parking, turning, and vehicle handling skills",
      level: "LEVEL 1",
      progress: "Basic Controls",
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
      lessonsCount: 28,
      progressValue: 60,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  const learningPaths = [
    {
      id: "1",
      title: "Beginner Driver Course",
      description: "Complete foundation course for new drivers starting from zero",
      levels: 8,
      duration: "4 weeks",
      students: "2.4k",
      icon: BookOpen,
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg" // or use external URLs
    },
    {
      id: "2",
      title: "Advanced Driving Skills",
      description: "Master complex driving scenarios and defensive techniques", 
      levels: 6,
      duration: "3 weeks",
      students: "1.8k",
      icon: Trophy,
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg" // or use external URLs
    },
    {
      id: "3",
      title: "Rwanda Road Test Prep",
      description: "Specific preparation for Rwanda driving license examination",
      levels: 5,
      duration: "2 weeks",
      students: "3.2k",
      icon: Users,
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg" // or use external URLs
    },
  ];

  const stats = [
    { title: "Active Learners", value: "12,847", icon: Users, change: "+12%" },
    { title: "Pass Rate", value: "94.2%", icon: Trophy, change: "+3.2%" },
    { title: "Practice Questions", value: "500+", icon: BookOpen, change: "Updated" },
    { title: "Avg. Completion", value: "86%", icon: TrendingUp, change: "+8%" },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mobileWeekDays = ["Mon", "Tue", "Wed", "Th", "Fr"];

  // Mobile modules data - updated to match featuredModules
const mobileModules = [
  {
    id: "1",
    title: "Traffic Signs & Signals",
    description: "Master all essential road signs, signals, and markings",
    level: "LEVEL 1", 
    progress: "Basic Road Signs",
    lessonsCount: 45,
    isPremium: false,
    imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg" // or use external URLs
  },
  {
    id: "2", 
    title: "Road Safety Rules",
    description: "Learn defensive driving techniques and emergency procedures",
    level: "LEVEL 2",
    progress: "Defensive Driving",
    lessonsCount: 32,
    isPremium: false,
    imageUrl: "https://greenwoodhigh.edu.in/wp-content/uploads/2024/01/2210.q713.014.P.m012.c25.children-road-rules-illustration-set-scaled.jpg"
  }
];

  // Calendar functionality
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

const startQuiz = (quizId: string) => {
  const quiz = lessonQuizzes.find(q => q.id === quizId);
  if (!quiz) return;

  console.log("Starting quiz:", quiz.title);

  setSelectedQuiz(quiz.id);
  setAgreedToTerms(true); // Auto-agree
  setExamStarted(true);

  // Navigate directly to the quiz page
  setLocation(`/ibibazo`);
};

// Start a random quiz
const startRandomExam = () => {
  const randomQuiz = lessonQuizzes[Math.floor(Math.random() * lessonQuizzes.length)];
  startQuiz(randomQuiz.id);
};
  // Module progress functionality - NOW NAVIGATES TO LESSONS PAGE
  const continueModule = (moduleId: string) => {
    // Navigate to lessons page with the specific module pre-selected
    setLocation(`/inyigisho`);
  };

  // Learning path functionality
  const exploreLearningPath = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (path) {
      // Navigate to lessons page when exploring a learning path
      setLocation("/inyigisho");
    }
  };

  // Day selection functionality
  const handleDaySelect = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    // In a real app, this would load the content for the selected day
    alert(`Loading content for ${weekDays[dayIndex]}...`);
  };

  // Calendar day click functionality
  const handleCalendarDayClick = (day: number) => {
    if (day) {
      const date = new Date(currentYear, currentMonth, day);
      alert(`Selected date: ${date.toDateString()}\nViewing study sessions for this date...`);
    }
  };

  // View all lessons functionality - NAVIGATES TO LESSONS PAGE
  const viewAllLessons = () => {
    setLocation("/inyigisho");
  };

  // View detailed analytics functionality
  const viewDetailedAnalytics = () => {
    setLocation("/analytics");
  };

  // Get month name
  const getMonthName = (month: number) => {
    return new Date(currentYear, month).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* For You Section */}
          <section className="mb-8">
            <h2 className="text-black text-2xl font-bold mb-4 px-2">For you</h2>
            
            {/* Practice Card */}
            <Card className="mb-6 mx-2 bg-green-100">
              <CardContent className="p-4">
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-black" />
                          <span className="text-xs font-semibold text-black-400">DAILY CHALLENGE</span>
                        </div>
                  <h3 className="text-sm font-semibold leading-tight">
                    Sharpen your skills in 5 days with a quick practice exams
                  </h3>
                  <Button 
                    className="w-full gap-2 bg-primary hover:bg-primary/90 h-10 text-sm"
                    onClick={startRandomExam}
                  >
                    {practiceProgress > 0 ? `In Progress... ${practiceProgress}%` : "Start practice"}
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Week Days - Mobile Only */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 px-2 scrollbar-hide">
              {mobileWeekDays.map((day, index) => (
                <button
                  key={day}
                  onClick={() => handleDaySelect(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                    index === selectedDay 
                      ? "bg-green-500 text-primary-foreground" 
                      : "bg-background text-foreground border-border"
                  }`}
                >
                  <div className={`${index === selectedDay ? "text-primary-foreground" : "text-muted-foreground"}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                    </svg>
                  </div>
                  <span>{day}</span>
                </button>
              ))}
            </div>
           
            {/* Divider */}
            <div className="border-t border-border my-6 mx-2"></div>

            {/* Jump Back In Section */}
            <div className="mb-6 px-2">
              <h3 className="text-lg font-semibold mb-3">Jump back in</h3>
              
              {/* Progress Cards */}
              <div className="space-y-3 mb-4">
                {mobileModules.map((module) => (
                  <Card 
                    key={module.id} 
                    className="hover:shadow-md transition-shadow bg-green-100 cursor-pointer"
                    onClick={() => continueModule(module.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{module.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{module.level}</p>
                          <p className="text-sm font-medium">{module.progress}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 flex-shrink-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            continueModule(module.id);
                          }}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                      <Progress value={75} className="h-1 mb-1" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>75% complete</span>
                        <span>Continue</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* All Lessons Button - NOW NAVIGATES TO LESSONS PAGE */}
              <Button 
                variant="outline" 
                className="w-full gap-2 h-10 text-sm"
                onClick={viewAllLessons}
              >
                All Lessons
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>

            {/* Lesson Cards Grid */}
<div className="space-y-3 px-2">
  {mobileModules.map((module, index) => (
    <Card 
      key={module.id} 
      className="hover:shadow-md transition-shadow bg-green-100 cursor-pointer"
      onClick={() => continueModule(module.id)}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image Section */}
          <div className="flex-shrink-0">
            <img 
              src={module.imageUrl || "/placeholder-image.jpg"} 
              alt={module.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          
          {/* Content Section */}
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-sm">{module.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {module.description}
            </p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{module.lessonsCount} lessons</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  continueModule(module.id);
                }}
              >
                Start
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
          </section>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Learning Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Daily Practice */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    For You
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Today's Progress</span>
                  </div>
                </div>
 {/* Quick Practice Card */}
                <Card className="bg-green-100 text-black mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-black" />
                          <span className="text-xs font-semibold text-black-400">DAILY CHALLENGE</span>
                        </div>
                        <h3 className="text-xs text-black font-bold leading-tight">
                          Sharpen your skills with today's quick practice exam
                        </h3>
                      </div>
                      <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                        <Star className="h-6 w-6 text-yellow-400" />
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-2 bg-primary text-slate-900 hover:bg-primary/90 h-4 text-sm font-semibold shadow-lg shadow-white/20"
                      onClick={startRandomExam}
                      disabled={practiceProgress > 0 && practiceProgress < 100}
                    >
                      {practiceProgress > 0 ? (
                        <>
                          <Progress value={practiceProgress} className="w-20 h-2 mr-2 bg-white/30" />
                          {practiceProgress}% Complete
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Start Practice Session
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                {/* Week Navigation */}
                <Card className="mb-2 border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      {weekDays.map((day, index) => (
                        <button
                          key={day}
                          onClick={() => handleDaySelect(index)}
                          className={`flex-1 flex flex-col items-center gap-2 py-1 rounded-xl transition-all duration-300 group ${
                            index === selectedDay
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105 ring-2 ring-primary/20" 
                              : "bg-white/60 text-muted-foreground hover:bg-white hover:shadow-md hover:scale-102 border border-white/50"
                          }`}
                        >
                          <div className={`transition-transform duration-300 group-hover:scale-110 ${
                            index === selectedDay 
                              ? "text-primary-foreground" 
                              : "text-muted-foreground/70 group-hover:text-primary/80"
                          }`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                            </svg>
                          </div>
                          
                          <span className={`text-sm font-semibold transition-colors ${
                            index === selectedDay 
                              ? "text-primary-foreground" 
                              : "text-foreground/80 group-hover:text-foreground"
                          }`}>
                            {day}
                          </span>
                          
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === selectedDay 
                              ? "bg-primary-foreground/60" 
                              : index < selectedDay 
                                ? "bg-green-400" 
                                : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                          }`} />
                        </button>
                      ))}
                    </div>
                    
                    {/* Week Progress Bar */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 bg-white/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${((selectedDay + 1) / 7) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        Week {Math.ceil((selectedDay + 1) / 7)} • {Math.round(((selectedDay + 1) / 7) * 100)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Continue Learning */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Continue Learning
                  </h2>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-muted-foreground"
                    onClick={viewAllLessons}
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {featuredModules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <Card 
                        key={module.id} 
                        className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden cursor-pointer"
                        onClick={() => continueModule(module.id)}
                      >
                        <CardContent className="p-0">
                          <div className="p-6">
                            
                            <div className="flex items-start justify-between mb-4">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl bg-gradient-to-r ${module.color}`}>
                                    <Icon className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-foreground">{module.title}</h3>
                                    <p className="text-xs text-muted-foreground">{module.level}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {module.description}
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  continueModule(module.id);
                                }}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-foreground">{module.progress}</span>
                                <span className="text-muted-foreground">{module.progressValue}%</span>
                              </div>
                              <Progress value={module.progressValue} className="h-2 bg-slate-200" />
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{module.lessonsCount} lessons</span>
                                <span>Continue learning</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

             {/* Learning Paths */}
<section>
  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
    Learning Paths
  </h2>
  
  <div className="grid grid-cols-2 gap-6">
    {learningPaths.map((path) => {
      const Icon = path.icon;
      return (
        <Card 
          key={path.id} 
          className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm overflow-hidden cursor-pointer"
          onClick={() => exploreLearningPath(path.id)}
        >
          <CardContent className="p-0">
            {/* Image Section */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
              <img 
                src={path.imageUrl || "/placeholder-path.jpg"} 
                alt={path.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              {/* Icon overlay */}
              <div className="absolute top-4 left-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6">
              <div className="space-y-3 flex-1">
                <h3 className="font-semibold text-foreground text-lg">{path.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {path.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 mt-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {path.levels} levels
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {path.duration}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {path.students}
                </span>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  exploreLearningPath(path.id);
                }}
              >
                Explore Path
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
</section>
            </div>

            {/* Right Column - Calendar & Progress */}
            <div className="space-y-12">
              {/* Study Calendar */}
              <section>
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Study Calendar</h3>
                        <p className="text-sm text-muted-foreground">Track your learning journey</p>
                      </div>
                    </div>
                    
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                        onClick={handlePrevMonth}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold text-foreground">
                        {getMonthName(currentMonth)} {currentYear}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                        onClick={handleNextMonth}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Calendar Grid */}
                   <div className="grid grid-cols-7 gap-1 mb-3">
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
      {day.charAt(0)}
    </div>
  ))}
</div>

                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, index) => (
                        <button
                          key={index}
                          onClick={() => day && handleCalendarDayClick(day)}
                          className={`h-8 rounded-lg text-xs font-medium transition-all ${
                            day === new Date().getDate() && 
                            currentMonth === new Date().getMonth() && 
                            currentYear === new Date().getFullYear()
                              ? "bg-blue-500 text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                              : day && day <= new Date().getDate() && 
                                currentMonth === new Date().getMonth() && 
                                currentYear === new Date().getFullYear()
                              ? "bg-green-500 text-white shadow-md shadow-green-500/25"
                              : "text-foreground hover:bg-slate-100 hover:scale-105"
                          } ${!day ? 'invisible' : ''}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    {/* Calendar Legend */}
                    <div className="mt-6 space-y-3 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                        <span className="text-muted-foreground">Completed sessions</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-muted-foreground">Today's session</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Weekly Progress */}
              <section>
                <Card className="border-0 bg-white text-black shadow-2xl shadow-indigo-500/25">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Weekly Progress</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Learning Time</span>
                        <span className="text-sm font-semibold">
                          {Math.floor(userProgress.learningTime / 60)}h {userProgress.learningTime % 60}m
                        </span>
                      </div>
                      <Progress 
                        value={(userProgress.learningTime / (10 * 60)) * 100} 
                        className="h-2 bg-white/20" 
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Lessons Completed</span>
                        <span className="text-sm font-semibold">
                          {userProgress.lessonsCompleted}/{userProgress.totalLessons}
                        </span>
                      </div>
                      <Progress 
                        value={(userProgress.lessonsCompleted / userProgress.totalLessons) * 100} 
                        className="h-2 bg-white/20" 
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Practice Tests</span>
                        <span className="text-sm font-semibold">{userProgress.practiceTests}% Avg.</span>
                      </div>
                      <Progress value={userProgress.practiceTests} className="h-2 bg-white/20" />
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white border-0 h-10"
                      onClick={viewDetailedAnalytics}
                    >
                      View Detailed Analytics
                    </Button>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 