import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp?: () => void;
}

export default function QuizTimer({ totalSeconds, onTimeUp }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const getColorClass = () => {
    if (timeLeft <= 60) return "bg-destructive text-destructive-foreground";
    if (timeLeft <= 300) return "bg-chart-3 text-white";
    return "bg-primary text-primary-foreground";
  };

  const isPulsing = timeLeft <= 60;

  return (
    <div
      className={`fixed top-20 right-4 z-40 ${getColorClass()} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg ${
        isPulsing ? "animate-pulse" : ""
      }`}
      data-testid="timer-quiz"
    >
      <Clock className="h-4 w-4" />
      <span className="font-mono font-semibold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
