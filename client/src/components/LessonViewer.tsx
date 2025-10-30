// components/LessonViewer.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, Clock, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LessonViewerProps {
  title: string;
  content: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onTryQuiz: () => void;
  metadata?: {
    level: string;
    duration: string;
    category: string;
    progress: number;
  };
}

export default function LessonViewer({
  title,
  content,
  isCompleted,
  onMarkComplete,
  onTryQuiz,
  metadata,
}: LessonViewerProps) {
  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {isCompleted && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              
              {metadata && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{metadata.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{metadata.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{metadata.category}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={isCompleted ? "outline" : "default"}
                onClick={onMarkComplete}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isCompleted ? "Mark Incomplete" : "Mark Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={onTryQuiz}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Take Quiz
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {metadata && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Lesson Progress</span>
                <span className="font-semibold">{metadata.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metadata.progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-6">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onMarkComplete} className="gap-2">
          <CheckCircle className="h-4 w-4" />
          {isCompleted ? "Mark Incomplete" : "Mark Complete"}
        </Button>
        
        <Button onClick={onTryQuiz} className="gap-2">
          <Play className="h-4 w-4" />
          Take Quiz
        </Button>
      </div>
    </div>
  );
}