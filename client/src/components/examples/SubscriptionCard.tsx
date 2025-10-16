import SubscriptionCard from '../SubscriptionCard'

export default function SubscriptionCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <SubscriptionCard
        title="Monthly"
        price={6000}
        duration="per month"
        features={[
          "Unlimited mock exams",
          "All 8 modules unlocked",
          "Progress tracking",
          "Weekly reports",
          "Image-based questions"
        ]}
        isPopular={true}
        onSubscribe={() => console.log('Subscribe clicked')}
      />
    </div>
  )
}
