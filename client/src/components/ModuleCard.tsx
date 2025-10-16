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
    <Card className="overflow-hidden hover-elevate transition-all duration-300 group" data-testid={`card-module-${id}`}>
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Lock className="h-10 w-10 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Premium Only</p>
            </div>
          </div>
        )}
        {isPremium && !isLocked && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
              Premium
            </span>
          </div>
        )}
      </div>
      
      <CardHeader className="space-y-3 pb-4">
        <h3 className="font-bold text-xl leading-tight" data-testid={`text-module-title-${id}`}>{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">{lessonsCount} Amasomo</span>
          <span className="font-semibold text-primary">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/inyigisho/${id}`} className="w-full">
          <Button className="w-full gap-2 font-semibold" size="lg" disabled={isLocked} data-testid={`button-start-module-${id}`}>
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
