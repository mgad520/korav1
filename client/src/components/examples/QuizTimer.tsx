import QuizTimer from '../QuizTimer'

export default function QuizTimerExample() {
  return (
    <div className="relative h-32">
      <QuizTimer 
        totalSeconds={120} 
        onTimeUp={() => console.log('Time is up!')} 
      />
    </div>
  )
}
