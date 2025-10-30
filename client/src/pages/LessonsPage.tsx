import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Clock, CheckCircle, Play, ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);

  // Enhanced lessons data with images
  const lessons = [
    {
      id: 1,
      title: "Traffic Signs & Signals",
      description: "Master all essential road signs, signals, and markings for safe driving in Rwanda",
      level: "LEVEL 1",
      progress: "Basic Road Signs",
      lessonsCount: 45,
      progressValue: 75,
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
      duration: "45 min",
      category: "Traffic Rules",
      content: `
        <h2>Traffic Signs & Signals</h2>
        <p class="lead">Understanding traffic signs is fundamental to safe driving in Rwanda. These visual communications help maintain order and prevent accidents.</p>
        
        <h3>📋 Categories of Traffic Signs</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="font-semibold text-blue-800 mb-2">Regulatory Signs</h4>
            <p class="text-sm text-blue-700">Tell you what you must or must not do. These are usually circular with red borders.</p>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 class="font-semibold text-orange-800 mb-2">Warning Signs</h4>
            <p class="text-sm text-orange-700">Alert you to potential hazards ahead. Typically triangular with red borders.</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 class="font-semibold text-green-800 mb-2">Informational Signs</h4>
            <p class="text-sm text-green-700">Provide helpful information about routes, distances, and services. Usually rectangular.</p>
          </div>
        </div>

        <h3>🚦 Common Rwandan Traffic Signs</h3>
        <ul class="space-y-3 my-4">
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">ST</div>
            <div>
              <strong>Stop Sign:</strong> Come to complete stop at the intersection
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">YW</div>
            <div>
              <strong>Yield Sign:</strong> Give way to oncoming traffic
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">SL</div>
            <div>
              <strong>Speed Limit:</strong> Maximum allowed speed in km/h
            </div>
          </li>
        </ul>

        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <div class="flex">
            <div class="flex-shrink-0">💡</div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> Always scan ahead for traffic signs and prepare to react accordingly. 
                Missing a sign could lead to traffic violations or accidents.
              </p>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: 2,
      title: "Road Safety Rules",
      description: "Learn defensive driving techniques and emergency procedures",
      level: "LEVEL 2",
      progress: "Defensive Driving",
      lessonsCount: 32,
      progressValue: 40,
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
      duration: "38 min",
      category: "Safety",
      content: `
        <h2>Road Safety Rules</h2>
        <p class="lead">Defensive driving techniques and safety procedures are essential for preventing accidents and ensuring road safety in Rwanda.</p>
        
        <h3>🛡️ Defensive Driving Principles</h3>
        <div class="space-y-4 my-6">
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">1</div>
            <div>
              <h4 class="font-semibold mb-1">Maintain Safe Following Distance</h4>
              <p class="text-sm text-gray-700">Keep at least 3 seconds between you and the vehicle ahead. Increase this distance in poor weather conditions.</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">2</div>
            <div>
              <h4 class="font-semibold mb-1">Scan the Road Continuously</h4>
              <p class="text-sm text-gray-700">Look 12-15 seconds ahead and check mirrors every 5-8 seconds to anticipate potential hazards.</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">3</div>
            <div>
              <h4 class="font-semibold mb-1">Expect the Unexpected</h4>
              <p class="text-sm text-gray-700">Assume other drivers might make mistakes and be prepared to react safely.</p>
            </div>
          </div>
        </div>

        <h3>🚨 Emergency Procedures</h3>
        <table class="w-full border-collapse border border-gray-300 my-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-3 text-left">Situation</th>
              <th class="border border-gray-300 p-3 text-left">Correct Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 p-3">Brake Failure</td>
              <td class="border border-gray-300 p-3">Pump brakes, downshift, use emergency brake</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="border border-gray-300 p-3">Tire Blowout</td>
              <td class="border border-gray-300 p-3">Grip wheel firmly, don't brake suddenly, steer straight</td>
            </tr>
            <tr>
              <td class="border border-gray-300 p-3">Skidding</td>
              <td class="border border-gray-300 p-3">Steer in direction of skid, avoid braking</td>
            </tr>
          </tbody>
        </table>
      `,
    },
    {
      id: 3,
      title: "Vehicle Control & Maneuvers",
      description: "Master parking, turning, and vehicle handling skills",
      level: "LEVEL 1",
      progress: "Basic Controls",
      lessonsCount: 28,
      progressValue: 60,
      imageUrl: "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
      duration: "52 min",
      category: "Vehicle Operation",
      content: `
        <h2>Vehicle Control & Maneuvers</h2>
        <p class="lead">Proper vehicle control and mastering essential maneuvers are crucial for safe and confident driving in various road conditions.</p>
        
        <h3>🅿️ Parking Techniques</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 class="font-semibold text-purple-800 mb-3">Parallel Parking</h4>
            <ol class="text-sm text-purple-700 space-y-2">
              <li>1. Signal and stop beside the space</li>
              <li>2. Reverse until rear wheel aligns with other car's bumper</li>
              <li>3. Turn wheel fully toward curb</li>
              <li>4. Straighten wheels when at 45-degree angle</li>
              <li>5. Adjust position as needed</li>
            </ol>
          </div>
          <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-800 mb-3">Perpendicular Parking</h4>
            <ol class="text-sm text-indigo-700 space-y-2">
              <li>1. Approach space at wide angle</li>
              <li>2. Turn wheel when front seat aligns with line</li>
              <li>3. Straighten wheels in the center</li>
              <li>4. Check both sides before opening doors</li>
            </ol>
          </div>
        </div>

        <h3>🔄 Turning and Lane Changes</h3>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <h4 class="font-semibold text-blue-800 mb-2">SMOG Technique</h4>
          <div class="flex items-center justify-between text-sm text-blue-700">
            <span><strong>S</strong>ignal</span>
            <span><strong>M</strong>irrors</span>
            <span><strong>O</strong>ver shoulder</span>
            <span><strong>G</strong>o</span>
          </div>
        </div>

        <h3>🎯 Steering Control Methods</h3>
        <div class="space-y-3 my-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span class="font-medium">Hand-over-Hand</span>
            <span class="text-sm text-gray-600">For sharp turns and parking</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span class="font-medium">Push-Pull</span>
            <span class="text-sm text-gray-600">For normal turns and lane changes</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span class="font-medium">One-Hand</span>
            <span class="text-sm text-gray-600">Only when reversing</span>
          </div>
        </div>
      `,
    },
    {
      id: 4,
      title: "Speed Limits and Road Markings",
      description: "Understand speed regulations and road marking systems",
      level: "LEVEL 1",
      progress: "Regulations",
      lessonsCount: 22,
      progressValue: 25,
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
      duration: "35 min",
      category: "Traffic Rules",
      content: `
        <h2>Speed Limits and Road Markings</h2>
        <p class="lead">Understanding and adhering to speed limits and road markings is essential for legal and safe driving in Rwanda.</p>
        
        <h3>📏 Rwandan Speed Limits</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">40</div>
            <div class="text-sm text-red-700">Urban Areas</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="text-2xl font-bold text-yellow-600">60</div>
            <div class="text-sm text-yellow-700">Rural Roads</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">80</div>
            <div class="text-sm text-green-700">Highways</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">100</div>
            <div class="text-sm text-blue-700">Expressways</div>
          </div>
        </div>

        <h3>🛣️ Road Markings System</h3>
        <div class="space-y-4 my-6">
          <div class="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <div class="w-16 h-2 bg-white border-t-4 border-yellow-400"></div>
            <div>
              <h4 class="font-semibold">Yellow Lines</h4>
              <p class="text-sm text-gray-600">Separate traffic moving in opposite directions</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <div class="w-16 h-2 bg-white border-t-4 border-white"></div>
            <div>
              <h4 class="font-semibold">White Lines</h4>
              <p class="text-sm text-gray-600">Separate traffic moving in the same direction</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <div class="w-16 h-2 bg-white border-dashed border-t-2 border-white"></div>
            <div>
              <h4 class="font-semibold">Dashed Lines</h4>
              <p class="text-sm text-gray-600">Can be crossed when safe to do so</p>
            </div>
          </div>
        </div>
      `,
    },
  ];

  const currentLesson = lessons.find((l) => l.id === selectedLesson);

  const handleMarkComplete = (lessonId: number) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleTryQuiz = (lessonId: number) => {
    alert(`Starting quiz for lesson ${lessonId}`);
    // In real app: navigate to quiz page
  };

  const getLessonProgress = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.progressValue : 0;
  };

  // Lesson Viewer Component
  const LessonViewer = ({ 
    title, 
    content, 
    isCompleted, 
    onMarkComplete, 
    onTryQuiz, 
    metadata 
  }: {
    title: string;
    content: string;
    isCompleted: boolean;
    onMarkComplete: () => void;
    onTryQuiz: () => void;
    metadata: {
      level: string;
      duration: string;
      category: string;
      progress: number;
    };
  }) => {
    const currentLessonIndex = lessons.findIndex(lesson => lesson.title === title);
    const hasPreviousLesson = currentLessonIndex > 0;
    const hasNextLesson = currentLessonIndex < lessons.length - 1;

    const handlePreviousLesson = () => {
      if (hasPreviousLesson) {
        setSelectedLesson(lessons[currentLessonIndex - 1].id);
      }
    };

    const handleNextLesson = () => {
      if (hasNextLesson) {
        setSelectedLesson(lessons[currentLessonIndex + 1].id);
      }
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-9 px-2"
                onClick={() => setSelectedLesson(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Lessons</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {currentLessonIndex + 1}/{lessons.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setSelectedLesson(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lessons
            </Button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="space-y-6">
            {/* Lesson Header */}
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {metadata.level}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                  {metadata.category}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                  {metadata.duration}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto md:mx-0">
                {lessons.find(l => l.title === title)?.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {metadata.progress}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metadata.progress}%` }}
                />
              </div>
            </div>

            {/* Lesson Content */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div 
                  className="prose prose-sm md:prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={isCompleted ? "outline" : "default"}
                className="flex-1 gap-2 h-12"
                onClick={onMarkComplete}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 gap-2 h-12"
                onClick={onTryQuiz}
              >
                <Play className="h-4 w-4" />
                Try Quiz
              </Button>
            </div>

            {/* Navigation - Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
              <div className="flex justify-between items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 h-10"
                  onClick={handlePreviousLesson}
                  disabled={!hasPreviousLesson}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-12 justify-center">
                  <span>{currentLessonIndex + 1}</span>
                  <span>/</span>
                  <span>{lessons.length}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 h-10"
                  onClick={handleNextLesson}
                  disabled={!hasNextLesson}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex justify-between items-center pt-6 border-t">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handlePreviousLesson}
                disabled={!hasPreviousLesson}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Lesson {currentLessonIndex + 1} of {lessons.length}</span>
              </div>
              
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleNextLesson}
                disabled={!hasNextLesson}
              >
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Add some padding at the bottom for mobile to account for fixed navigation */}
        <div className="md:hidden h-20"></div>
      </div>
    );
  };

  // Mobile: Show lesson list or lesson content based on selection
  const renderMobileView = () => {
    // If a lesson is selected, show the lesson content
    if (selectedLesson) {
      const lesson = lessons.find(l => l.id === selectedLesson);
      if (!lesson) return null;
      
      return (
        <LessonViewer
          title={lesson.title}
          content={lesson.content}
          isCompleted={completedLessons.includes(lesson.id)}
          onMarkComplete={() => handleMarkComplete(lesson.id)}
          onTryQuiz={() => handleTryQuiz(lesson.id)}
          metadata={{
            level: lesson.level,
            duration: lesson.duration,
            category: lesson.category,
            progress: getLessonProgress(lesson.id),
          }}
        />
      );
    }

    // If no lesson selected, show the lessons list
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground ">Driving Lessons</h1>
          <p className="text-muted-foreground mt-1">
            {completedLessons.length} of {lessons.length} lessons completed
          </p>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <Card 
                key={lesson.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Image instead of icon */}
                    <div className="flex-shrink-0">
                      <img 
                        src={lesson.imageUrl} 
                        alt={lesson.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {lesson.title}
                        </h3>
                        {isCompleted && (
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span>{lesson.level}</span>
                      </div>
                      
                      {/* Progress bar for each lesson */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{getLessonProgress(lesson.id)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${getLessonProgress(lesson.id)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Overall Progress */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold">
                {Math.round((completedLessons.length / lessons.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Desktop: Show header with back to home button */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <Link href="/ahabanza">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-foreground">Driving Lessons</h1>
            <p className="text-muted-foreground mt-1">
              {completedLessons.length} of {lessons.length} lessons completed
            </p>
          </div>
        </div>

        {/* Mobile: Show simple back to home button at top */}
        <div className="md:hidden mb-6">
          <Link href="/ahabanza">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {renderMobileView()}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid lg:grid-cols-4 gap-8">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">All Lessons</h3>
                    <p className="text-sm text-muted-foreground">
                      {lessons.length} lessons available
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isSelected = selectedLesson === lesson.id;
                    
                    return (
                      <Button
                        key={lesson.id}
                        variant={isSelected ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto p-4 relative"
                        onClick={() => setSelectedLesson(lesson.id)}
                        data-testid={`button-lesson-${lesson.id}`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          {/* Image instead of icon */}
                          <div className="flex-shrink-0">
                            <img 
                              src={lesson.imageUrl} 
                              alt={lesson.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">
                                {lesson.title}
                              </span>
                              {isCompleted && (
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration}</span>
                              <span>•</span>
                              <span>{lesson.level}</span>
                            </div>
                            
                            {/* Progress bar for each lesson */}
                            <div className="mt-2">
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span>{getLessonProgress(lesson.id)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${getLessonProgress(lesson.id)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Overall Progress */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-semibold">
                      {Math.round((completedLessons.length / lessons.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            {currentLesson ? (
              <LessonViewer
                title={currentLesson.title}
                content={currentLesson.content}
                isCompleted={completedLessons.includes(currentLesson.id)}
                onMarkComplete={() => handleMarkComplete(currentLesson.id)}
                onTryQuiz={() => handleTryQuiz(currentLesson.id)}
                metadata={{
                  level: currentLesson.level,
                  duration: currentLesson.duration,
                  category: currentLesson.category,
                  progress: getLessonProgress(currentLesson.id),
                }}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Lesson</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose a lesson from the sidebar to start learning
                  </p>
                  <Button onClick={() => setSelectedLesson(lessons[0].id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start First Lesson
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}