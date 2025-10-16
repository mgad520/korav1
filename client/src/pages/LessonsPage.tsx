import { useState } from "react";
import LessonViewer from "@/components/LessonViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(1);

  //todo: remove mock functionality
  const lessons = [
    {
      id: 1,
      title: "Introduction to Traffic Signs",
      content: `
        <h3>Understanding Traffic Signs</h3>
        <p>Traffic signs are essential tools for road safety. They provide crucial information to drivers and help maintain order on the roads.</p>
        
        <h4>Categories of Traffic Signs:</h4>
        <ul>
          <li><strong>Regulatory Signs:</strong> Tell you what you must or must not do</li>
          <li><strong>Warning Signs:</strong> Alert you to potential hazards ahead</li>
          <li><strong>Informational Signs:</strong> Provide helpful information about routes and services</li>
        </ul>
        
        <p>Always pay attention to traffic signs and follow their instructions for safe driving.</p>
      `,
      isCompleted: false,
    },
    {
      id: 2,
      title: "Speed Limits and Road Markings",
      content: `
        <h3>Speed Limits in Rwanda</h3>
        <p>Adhering to speed limits is crucial for road safety and preventing accidents.</p>
        
        <h4>Standard Speed Limits:</h4>
        <ul>
          <li><strong>Urban Areas:</strong> 40 km/h</li>
          <li><strong>Rural Roads:</strong> 60 km/h</li>
          <li><strong>Highways:</strong> 80-100 km/h</li>
        </ul>
        
        <h4>Road Markings:</h4>
        <p>White lines separate traffic moving in the same direction, while yellow lines separate opposite traffic flows.</p>
      `,
      isCompleted: false,
    },
  ];

  const currentLesson = lessons.find((l) => l.id === selectedLesson);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold mb-4">Lessons</h3>
                {lessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant={selectedLesson === lesson.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedLesson(lesson.id)}
                    data-testid={`button-lesson-${lesson.id}`}
                  >
                    {lesson.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {currentLesson && (
              <LessonViewer
                title={currentLesson.title}
                content={currentLesson.content}
                isCompleted={currentLesson.isCompleted}
                onMarkComplete={() => console.log("Mark complete")}
                onTryQuiz={() => console.log("Try quiz")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
