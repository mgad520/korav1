import ModuleCard from '../ModuleCard'
import trafficSignsImage from '@assets/generated_images/Traffic_signs_module_thumbnail_8024bdd3.png'

export default function ModuleCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <ModuleCard
        id="1"
        title="Traffic Signs & Signals"
        description="Learn all essential traffic signs, road markings, and signal meanings for safe driving in Rwanda."
        image={trafficSignsImage}
        progress={65}
        lessonsCount={12}
        isPremium={false}
      />
    </div>
  )
}
