import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Clock, CheckCircle, Play, ArrowLeft, ChevronRight, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useRoute } from "wouter";
import Navbar from "@/components/Navbar";

// Types for our API responses
interface Section {
  id: string;
  title: string;
  sectionNumber: number;
}

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  sections: Section[];
  image: string;
}

interface Lesson {
  id: string;
  title: string;
  lesssonNumber: number;
  lessonImage: string | null;
}

interface LessonData {
  success: boolean;
  sectionId: string;
  data: Lesson[];
}

export default function LessonsPage() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLessons, setLoadingLessons] = useState<boolean>(false);
  const [currentLessons, setCurrentLessons] = useState<Lesson[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Get section ID from URL parameters
  const [match, params] = useRoute("/inyigisho/:sectionId?");
  const urlSectionId = params?.sectionId;

  // Fetch chapters and sections on component mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dataapis.wixsite.com/kora/_functions/ChaptersWithSections');
        const data: Chapter[] = await response.json();
        setChapters(data);
        
        // Expand all chapters by default for better UX
        const allChapterIds = new Set(data.map(chapter => chapter.id));
        setExpandedChapters(allChapterIds);
        
        // If URL has a section ID, load that section
        if (urlSectionId) {
          handleSectionClick(urlSectionId);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [urlSectionId]);

  // Fetch lessons for a specific section
  const fetchLessonsBySection = async (sectionId: string) => {
    try {
      setLoadingLessons(true);
      const response = await fetch('https://dataapis.wixsite.com/kora/_functions/LessonsBySection/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sectionId })
      });
      
      const data: LessonData = await response.json();
      
      if (data.success) {
        // Transform API lessons to match your existing format
        const transformedLessons = data.data.map((lesson, index) => ({
          id: parseInt(lesson.id.replace(/\D/g, '').slice(0, 8) || `${index + 1}`),
          title: lesson.title.split('\n')[0],
          description: lesson.title.length > 100 ? lesson.title.substring(0, 100) + '...' : lesson.title,
          progress: "In Progress",
          lessonsCount: data.data.length,
          progressValue: Math.min((index / data.data.length) * 100, 100),
          imageUrl: lesson.lessonImage || "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
          content: `
            <div class="flex flex-col md:flex-row gap-0 items-start">
              <!-- Text content on the left -->
              <div class="flex-1 min-w-0">
                <h2>${lesson.title.split('\n')[0]}</h2>
              </div>
              <!-- Image on the right corner -->
              ${lesson.lessonImage ? `
                <div class="flex-shrink-0 md:w-48">
                  <img 
                    src="${lesson.lessonImage}" 
                    alt="${lesson.title.split('\n')[0]}" 
                    class="rounded-lg w-full h-auto max-w-[200px] md:max-w-none"
                    style="object-fit: cover;"
                  />
                </div>
              ` : ''}
            </div>
          `
        }));

        setCurrentLessons(data.data);
        setLessons(transformedLessons);
        setSelectedSection(sectionId);
        
        // Update URL to reflect selected section
        window.history.replaceState(null, "", `/inyigisho/${sectionId}`);
        
        // Start with first lesson when section changes
        setSelectedLessonIndex(0);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    fetchLessonsBySection(sectionId);
  };

  const handleSectionSelect = (sectionId: string) => {
    // Navigate to the section URL
    window.location.href = `/inyigisho/${sectionId}`;
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const expandAllChapters = () => {
    const allChapterIds = new Set(chapters.map(chapter => chapter.id));
    setExpandedChapters(allChapterIds);
  };

  const collapseAllChapters = () => {
    setExpandedChapters(new Set());
  };

  const currentLesson = lessons[selectedLessonIndex];

  const handleMarkComplete = (lessonId: number) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleTryQuiz = (lessonId: number) => {
    alert(`Starting quiz for lesson ${lessonId}`);
  };

  const getLessonProgress = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.progressValue : 0;
  };

  // Function to get section title by ID
  const getSectionTitle = (sectionId: string) => {
    for (const chapter of chapters) {
      const section = chapter.sections.find(s => s.id === sectionId);
      if (section) return section.title;
    }
    return "Unknown Section";
  };

  // Function to get chapter title for a section
  const getChapterTitleForSection = (sectionId: string) => {
    for (const chapter of chapters) {
      const section = chapter.sections.find(s => s.id === sectionId);
      if (section) return chapter.title;
    }
    return "Unknown Chapter";
  };

  // Lesson Viewer Component
  const LessonViewer = () => {
    const hasPreviousLesson = selectedLessonIndex > 0;
    const hasNextLesson = selectedLessonIndex < lessons.length - 1;

    const handlePreviousLesson = () => {
      if (hasPreviousLesson) {
        setSelectedLessonIndex(selectedLessonIndex - 1);
      }
    };

    const handleNextLesson = () => {
      if (hasNextLesson) {
        setSelectedLessonIndex(selectedLessonIndex + 1);
      }
    };

    const handleBackToSections = () => {
      // Clear the selected section and lessons
      setSelectedSection(null);
      setLessons([]);
      setCurrentLessons([]);
      // Update URL to remove section ID
      window.history.replaceState(null, "", "/inyigisho");
    };

    if (!currentLesson) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Lessons Available</h3>
            <p className="text-muted-foreground mb-6">
              Select a section from the chapters list to load lessons
            </p>
          </CardContent>
        </Card>
      );
    }

    const isCompleted = completedLessons.includes(currentLesson.id);

    return (
      <div className="min-h-screen bg-background">
        {/* Desktop Back Button */}
        <div className="hidden md:block max-w-4xl mx-auto px-6 pt-6">
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={handleBackToSections}
          >
            <ArrowLeft className="h-4 w-4" />
            Subira Inyuma
          </Button>
        </div>

        {/* Lesson Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20 md:pb-6">
          <div className="space-y-6">
            {/* Lesson Header */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl text-primary font-bold mb-3">Ibisobanuro birambuye</h1>
            </div>

            {/* Progress Bar */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentLesson.progressValue}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentLesson.progressValue}%` }}
                />
              </div>
            </div>

            {/* Lesson Content */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div 
                  className="prose prose-sm md:prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant={isCompleted ? "outline" : "default"}
                className="flex-1 gap-2 h-12"
                onClick={() => handleMarkComplete(currentLesson.id)}
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
                onClick={() => handleTryQuiz(currentLesson.id)}
              >
                <Play className="h-4 w-4" />
                Try Quiz
              </Button>
            </div>

            {/* Navigation - Fixed Bottom for Both Mobile and Desktop */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:relative md:bg-transparent md:border-t-0 md:p-0">
              <div className="flex justify-between items-center gap-4 max-w-4xl mx-auto">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-10 md:flex-initial md:px-4"
                  onClick={handlePreviousLesson}
                  disabled={!hasPreviousLesson}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="md:hidden">Previous</span>
                  <span className="hidden md:inline">Previous Lesson</span>
                </Button>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-12 justify-center">
                  <span>{selectedLessonIndex + 1}</span>
                  <span>/</span>
                  <span>{lessons.length}</span>
                </div>
                
                <Button
                  variant="outline"
                  className="flex-1 gap-2 h-10 md:flex-initial md:px-4"
                  onClick={handleNextLesson}
                  disabled={!hasNextLesson}
                >
                  <span className="md:hidden">Next</span>
                  <span className="hidden md:inline">Next Lesson</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add some padding at the bottom for mobile to account for fixed navigation */}
        <div className="md:hidden h-16"></div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading lessons...</span>
          </div>
        </div>
      </div>
    );
  }

  // Expandable Chapter Component for Desktop Sidebar
  const ChapterItem = ({ chapter }: { chapter: Chapter }) => {
    const isExpanded = expandedChapters.has(chapter.id);
    
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-between h-auto p-3 hover:bg-accent"
          onClick={() => toggleChapter(chapter.id)}
        >
          <div className="flex items-start gap-3 text-left flex-1 min-w-0">
            {/* Image preview for chapter from backend */}
            <div className="flex-shrink-0">
              <img 
                src={chapter.image} 
                alt={chapter.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="font-medium text-sm truncate">
                Chapter {chapter.chapterNumber}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {chapter.title}
              </div>
              
              {/* Chapter metadata */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{chapter.sections.length} sections</span>
                <span>•</span>
                <span>45-60 min</span>
              </div>
              
              {/* Progress bar for chapter */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `25%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="ml-4 space-y-1 border-l-2 border-muted pl-3">
            {chapter.sections.map((section) => (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto py-2 px-3 text-left min-w-0"
                onClick={() => handleSectionSelect(section.id)}
              >
                <div className="flex items-center gap-2 w-full min-w-0">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="text-xs font-medium truncate">
                      Section {section.sectionNumber}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {section.title}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Mobile Section List Component
  const MobileSectionList = () => (
    <div className="space-y-4 pb-4">
      {/* Expand/Collapse All Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={expandAllChapters}
          className="flex-1"
        >
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={collapseAllChapters}
          className="flex-1"
        >
          Collapse All
        </Button>
      </div>

      {/* Chapters and Sections */}
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-0 mb-3 hover:bg-transparent min-w-0"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex-1 min-w-0 overflow-hidden text-left">
                  <h3 className="font-semibold text-lg truncate">
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </h3>
                </div>
                {expandedChapters.has(chapter.id) ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 ml-2" />
                )}
              </Button>
              
              {expandedChapters.has(chapter.id) && (
                <div className="space-y-2">
                  {chapter.sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={selectedSection === section.id ? "secondary" : "outline"}
                      className="w-full justify-start h-auto py-3 text-left min-w-0"
                      onClick={() => handleSectionSelect(section.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <BookOpen className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="font-medium text-sm truncate">
                            Section {section.sectionNumber}: {section.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            Click to start learning
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {loadingLessons && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading lessons...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // If lessons are loaded and we have a current lesson, show the lesson viewer
  if (lessons.length > 0 && currentLesson && selectedSection) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <LessonViewer />
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid lg:grid-cols-4 gap-6">
            {/* Chapters and Sections Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base truncate">Chapters & Sections</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {chapters.length} chapters available
                      </p>
                    </div>
                  </div>

                  {/* Expand/Collapse All Buttons */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={expandAllChapters}
                      className="flex-1 text-xs h-8"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={collapseAllChapters}
                      className="flex-1 text-xs h-8"
                    >
                      Collapse All
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {chapters.map((chapter) => (
                      <ChapterItem key={chapter.id} chapter={chapter} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lesson Content */}
            <div className="lg:col-span-3">
              <LessonViewer />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show chapters and sections when no lessons are loaded
  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <MobileSectionList />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid lg:grid-cols-4 gap-6">
          {/* Chapters and Sections Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base truncate">Chapters & Sections</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {chapters.length} chapters available
                    </p>
                  </div>
                </div>

                {/* Expand/Collapse All Buttons */}
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={expandAllChapters}
                    className="flex-1 text-xs h-8"
                  >
                    Expand All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={collapseAllChapters}
                    className="flex-1 text-xs h-8"
                  >
                    Collapse All
                  </Button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {chapters.map((chapter) => (
                    <ChapterItem key={chapter.id} chapter={chapter} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Choose a Section</h3>
                <p className="text-muted-foreground mb-6">
                  Select a section from the chapters list to start learning
                </p>
                {loadingLessons && (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading lessons...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}