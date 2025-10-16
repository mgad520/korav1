import ProgressCard from '../ProgressCard'

export default function ProgressCardExample() {
  return (
    <div className="p-6 max-w-lg">
      <ProgressCard
        title="Weekly Progress"
        stats={{
          totalAttempts: 12,
          passRate: 75,
          averageScore: 82,
          studyTime: 8
        }}
      />
    </div>
  )
}
