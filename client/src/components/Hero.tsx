import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@assets/generated_images/Rwanda_road_hero_image_3ad99c89.png";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary/20" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Master Rwanda's Driving Theory Exam
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-10 font-medium leading-relaxed">
            Pass your driving test with confidence. Interactive lessons, image-based quizzes, and realistic mock exams designed for Rwanda learner drivers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto text-base md:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow" data-testid="button-get-started">
                Tangira Ubu <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/inyigisho">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto text-base md:text-lg px-8 py-6 bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/25 shadow-lg" data-testid="button-browse-lessons">
                Reba Amasomo
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-white/95 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="font-medium">8 Comprehensive Modules</span>
            </div>
            <div className="flex items-center gap-3 text-white/95 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="font-medium">200+ Practice Questions</span>
            </div>
            <div className="flex items-center gap-3 text-white/95 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="font-medium">Timed Mock Exams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
