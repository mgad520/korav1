import StatsCard from '../StatsCard'
import { TrendingUp } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <StatsCard
        title="Pass Rate"
        value="85%"
        icon={TrendingUp}
        description="Last 30 days"
      />
    </div>
  )
}
