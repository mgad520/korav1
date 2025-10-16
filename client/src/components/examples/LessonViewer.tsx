import LessonViewer from '../LessonViewer'

export default function LessonViewerExample() {
  return (
    <div className="p-6 max-w-4xl">
      <LessonViewer
        title="Understanding Traffic Signals"
        content={`
          <h3>Traffic Light Signals</h3>
          <p>Traffic lights are crucial for maintaining order on the roads. Here's what each color means:</p>
          <ul>
            <li><strong>Red:</strong> Stop completely and wait</li>
            <li><strong>Yellow/Amber:</strong> Prepare to stop if safe to do so</li>
            <li><strong>Green:</strong> Proceed when safe</li>
          </ul>
          <p>Always approach intersections with caution, even when you have a green light.</p>
        `}
        onMarkComplete={() => console.log('Mark complete clicked')}
        onTryQuiz={() => console.log('Try quiz clicked')}
      />
    </div>
  )
}
