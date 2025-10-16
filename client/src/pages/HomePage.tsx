import Hero from "@/components/Hero";
import ModuleCard from "@/components/ModuleCard";
import StatsCard from "@/components/StatsCard";
import { BookOpen, Trophy, Users, TrendingUp } from "lucide-react";
import trafficSignsImage from "@assets/generated_images/Traffic_signs_module_thumbnail_8024bdd3.png";
import roadSafetyImage from "@assets/generated_images/Road_safety_module_thumbnail_56e097d7.png";
import vehicleRulesImage from "@assets/generated_images/Vehicle_rules_module_thumbnail_586126c0.png";

export default function HomePage() {
  //todo: remove mock functionality
  const modules = [
    {
      id: "1",
      title: "Traffic Signs & Signals",
      description: "Learn all essential traffic signs, road markings, and signal meanings for safe driving in Rwanda.",
      image: trafficSignsImage,
      progress: 65,
      lessonsCount: 12,
      isPremium: false,
    },
    {
      id: "2",
      title: "Road Safety Rules",
      description: "Master the fundamental road safety principles, defensive driving techniques, and emergency procedures.",
      image: roadSafetyImage,
      progress: 40,
      lessonsCount: 10,
      isPremium: false,
    },
    {
      id: "3",
      title: "Vehicle & Driver Rules",
      description: "Understand vehicle maintenance requirements, driver responsibilities, and legal obligations.",
      image: vehicleRulesImage,
      progress: 0,
      lessonsCount: 8,
      isPremium: true,
      isLocked: true,
    },
  ];

  const stats = [
    { title: "Active Learners", value: "5,000+", icon: Users },
    { title: "Pass Rate", value: "87%", icon: Trophy },
    { title: "Practice Questions", value: "200+", icon: BookOpen },
    { title: "Success Stories", value: "3,200+", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">Learning Modules</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master Rwanda's driving theory with our comprehensive modules
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard key={module.id} {...module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
