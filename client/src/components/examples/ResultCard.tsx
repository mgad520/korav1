import ResultCard from '../ResultCard'

export default function ResultCardExample() {
  return (
    <div className="p-6 max-w-lg">
      <ResultCard
        score={34}
        totalQuestions={40}
        percentage={85}
        passingPercentage={80}
        timeTaken="38 minutes"
      />
    </div>
  )
}
