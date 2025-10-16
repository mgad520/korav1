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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Master Rwanda's Driving Theory Exam
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Pass your driving test with confidence. Interactive lessons, image-based quizzes, and realistic mock exams designed for Rwanda learner drivers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-get-started">
                Tangira Ubu <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/inyigisho">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-browse-lessons">
                Reba Amasomo
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>8 Comprehensive Modules</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>200+ Practice Questions</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Timed Mock Exams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
