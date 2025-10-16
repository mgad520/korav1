import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  lessonsCount: number;
  isLocked?: boolean;
  isPremium?: boolean;
}

export default function ModuleCard({
  id,
  title,
  description,
  image,
  progress,
  lessonsCount,
  isLocked = false,
  isPremium = false,
}: ModuleCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-module-${id}`}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
        )}
        {isPremium && !isLocked && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
              Premium
            </span>
          </div>
        )}
      </div>
      
      <CardHeader className="space-y-2">
        <h3 className="font-semibold text-lg" data-testid={`text-module-title-${id}`}>{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{lessonsCount} Amasomo</span>
          <span className="font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>

      <CardFooter>
        <Link href={`/inyigisho/${id}`} className="w-full">
          <Button className="w-full gap-2" disabled={isLocked} data-testid={`button-start-module-${id}`}>
            {isLocked ? (
              <>
                <Lock className="h-4 w-4" /> Locked
              </>
            ) : progress === 100 ? (
              <>
                <CheckCircle className="h-4 w-4" /> Review
              </>
            ) : progress > 0 ? (
              "Continue Learning"
            ) : (
              "Start Learning"
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
