import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Clock, CheckCircle, Play, ArrowLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
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

// Cache for chapters data
let chaptersCache: Chapter[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for lessons by section
const lessonsCache: Record<string, { data: any[], timestamp: number }> = {};

// Skeleton Components
const LessonContentSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="text-center md:text-left">
      <div className="h-8 bg-muted rounded w-3/4 mx-auto md:mx-0 mb-3"></div>
    </div>

    {/* Progress Bar Skeleton */}
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-muted rounded w-20"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
      <div className="w-full bg-muted rounded-full h-2"></div>
    </div>

    {/* Content Skeleton */}
    <Card className="overflow-hidden">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Text content skeleton */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="h-6 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
          {/* Image skeleton */}
          <div className="flex-shrink-0 md:w-48">
            <div className="w-full h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Navigation Skeletons */}
    <div className="flex justify-between items-center gap-4">
      <div className="flex-1 h-10 bg-muted rounded"></div>
      <div className="w-12 h-6 bg-muted rounded"></div>
      <div className="flex-1 h-10 bg-muted rounded"></div>
    </div>
  </div>
);

export default function LessonsPage() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLessons, setLoadingLessons] = useState<boolean>(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Get section ID from URL parameters
  const [match, params] = useRoute("/inyigisho/:sectionId?");
  const urlSectionId = params?.sectionId;

  // Fetch chapters on component mount with caching
  useEffect(() => {
    const fetchChapters = async () => {
      // Check cache first
      const now = Date.now();
      if (chaptersCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('Using cached chapters');
        setChapters(chaptersCache);
        
        // If URL has a section ID, load that section
        if (urlSectionId) {
          handleSectionSelect(urlSectionId);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('https://dataapis.wixsite.com/kora/_functions/ChaptersWithSections');
        const data: Chapter[] = await response.json();
        
        // Update cache
        chaptersCache = data;
        cacheTimestamp = Date.now();
        
        setChapters(data);
        
        // If URL has a section ID, load that section
        if (urlSectionId) {
          handleSectionSelect(urlSectionId);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [urlSectionId]);

  // Fetch lessons for a specific section with caching
  const fetchLessonsBySection = async (sectionId: string) => {
    // Check cache first
    const now = Date.now();
    const cachedLesson = lessonsCache[sectionId];
    if (cachedLesson && (now - cachedLesson.timestamp) < CACHE_DURATION) {
      console.log('Using cached lessons for section:', sectionId);
      setLessons(cachedLesson.data);
      setSelectedSection(sectionId);
      setSelectedLessonIndex(0);
      return;
    }

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
          progressValue: Math.round(Math.min((index / data.data.length) * 100, 100)),
          imageUrl: lesson.lessonImage || "https://c8.alamy.com/comp/2GE268G/set-of-road-safety-signs-warning-road-transport-symbol-vector-collection-2GE268G.jpg",
          content: `
  <div class="flex flex-col md:flex-row gap-6 items-start">
    <!-- Text content on the left -->
    <div class="flex-1 min-w-0">
      <h2>${lesson.title.split('\n')[0]}</h2>
      <p class="lead mt-4">${lesson.title.replace(/\n/g, '<br/>')}</p>
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

        // Update cache
        lessonsCache[sectionId] = {
          data: transformedLessons,
          timestamp: Date.now()
        };

        setLessons(transformedLessons);
        setSelectedSection(sectionId);
        setSelectedLessonIndex(0);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    // Update URL to reflect selected section
    window.history.pushState(null, "", `/inyigisho/${sectionId}`);
    
    // Expand the chapter containing this section
    const chapter = chapters.find(ch => ch.sections.some(s => s.id === sectionId));
    if (chapter) {
      setExpandedChapters(prev => new Set(prev).add(chapter.id));
    }
    
    fetchLessonsBySection(sectionId);
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
    const allChapterIds = chapters.map(chapter => chapter.id);
    setExpandedChapters(new Set(allChapterIds));
  };

  const collapseAllChapters = () => {
    setExpandedChapters(new Set());
  };

  const currentLesson = lessons[selectedLessonIndex];

  const handlePreviousLesson = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonIndex(selectedLessonIndex - 1);
    }
  };

  const handleNextLesson = () => {
    if (selectedLessonIndex < lessons.length - 1) {
      setSelectedLessonIndex(selectedLessonIndex + 1);
    }
  };

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
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
          )}
        </Button>
        
        {/* Line separator added below */}
        <div className="border-t-2 border-muted mx-3"></div>
        
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
            </div>
          </div>
          
          {expandedChapters.has(chapter.id) ? (
            <ChevronUp className="h-5 w-5 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="h-5 w-5 flex-shrink-0 ml-2" />
          )}
        </Button>
        
        {/* Line separator added below */}
        <div className="border-t-2 border-muted mb-3"></div>
        
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

      {loadingLessons && lessons.length === 0 && (
        <div className="text-center py-6">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading lessons...</p>
        </div>
      )}
    </div>
  );

  // Lesson Content Component
  const LessonContent = () => {
    const hasPreviousLesson = selectedLessonIndex > 0;
    const hasNextLesson = selectedLessonIndex < lessons.length - 1;

    return (
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

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
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
    );
  };

  // Loading state for initial chapters
  if (loading && chapters.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading chapters...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout
  const MobileLayout = () => (
    <div className="md:hidden">
      {selectedSection && lessons.length > 0 ? (
        <div className="space-y-6 pb-20">
          {/* Mobile Back Button */}
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => {
              setSelectedSection(null);
              setLessons([]);
              setSelectedLessonIndex(0);
              window.history.replaceState(null, "", "/inyigisho");
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sections
          </Button>

          {/* Lesson Content */}
          {loadingLessons ? (
            <LessonContentSkeleton />
          ) : (
            <LessonContent />
          )}
        </div>
      ) : (
        <MobileSectionList />
      )}
    </div>
  );

  // Desktop Layout
  const DesktopLayout = () => (
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

      {/* Content Area */}
      <div className="lg:col-span-3">
        {selectedSection && lessons.length > 0 ? (
          <div className="space-y-6">
            {loadingLessons ? (
              <LessonContentSkeleton />
            ) : (
              <LessonContent />
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Choose a Section</h3>
              <p className="text-muted-foreground mb-6">
                Select a section from the chapters list to start learning
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/ahabanza">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="inline">Subira Ahabanza</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <MobileLayout />
        <DesktopLayout />
      </div>
    </div>
  );
}